import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { db } from "@/lib/db";
import Pubs from "@/lib/models/pubs";
import { getServerSession } from "next-auth";
import { Types } from "mongoose";
import Users from "@/lib/models/users";
import blockeds from '@/lib/blocked';

const ONESIGNAL_API_KEY = process.env.ONESIGNAL_API_KEY;
const ONESIGNAL_APP_ID = process.env.ONESIGNAL_APP_ID;

//Web Push Notifications
async function webPushNotif(title, imgSrc, desc) {
  const url = "https://api.onesignal.com/notifications";
  const options = {
    method: "POST",
    headers: {
      accept: "application/json",
      Authorization: `Basic ${ONESIGNAL_API_KEY}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      headings: { es: title, en: title },
      chrome_web_image: imgSrc,
      chrome_web_icon: 'https://res.cloudinary.com/dtloj3d2a/image/upload/v1788990890/jppnmbmtjw3xywdepml6.png',
      chrome_web_badge: 'https://res.cloudinary.com/dtloj3d2a/image/upload/v1788990890/jppnmbmtjw3xywdepml6.png',
      contents: { es: desc, en: desc },
      web_url: "https://frens.site/home",
      app_id: `${ONESIGNAL_APP_ID}`,
      name: "Frens",
      included_segments: ["Total Subscriptions"],
    }),
  };

  const res = await fetch(url, options);
  
  return await res.json();
}

//CLOUDYNARI CREDENTIALS
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

//GET YT ID
function get_video_id(input) {
  let yt_id = false;
  try {
    yt_id = input.match(
      /(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/user\/\S+|\/ytscreeningroom\?v=|\/sandalsResorts#\w\/\w\/.*\/))([^\/&]{10,12})/
    )[1];
  } catch (error) {
    yt_id = false;
  }
  return yt_id.replace("?", "");
}

export const POST = async (req) => {
  //GET SESSION
  const { user } = await getServerSession();
  if (!user) return NextResponse.status(401);
  if(blockeds.includes(user.email)) return NextResponse.json({msg: 'BLOCKED USER'});
  await db();
  //GET USER DATA FROM DB
  const { image: imgDB, pubcountperday } = await Users.findOne({email: user.email}, {image: 1, _id: 0, pubcountperday: 1}).lean();
  //CHECK PUBS PER DAY LIMIT
  if(pubcountperday <= 0) return NextResponse.json({msg: 'PUB LIMITS REACHED'});
  //SUBSTRACT ONE PUBCOUNTPERDAY
  await Users.findOneAndUpdate({email: user.email}, {$inc: {pubcountperday: -1}});
  //INIT
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");
  const data = await req.formData();
  const title = data.get('title') || "";
  const description = data.get("description") || "";
  const image = data.get("file") || null;
  const audio = data.get("audio") || null;
  if(!title || title.length > 50) return NextResponse.json({err: 'BAD TITLE'});

  //SWITCH TYPE
  switch (type) {
    //TEXT
    case "text": {
      if (!description || description.length > 500)
        NextResponse.json({ err: "EMPTY OR LARGE" });
      await Pubs.create({
        author: user.name,
        avatar: imgDB,
        title: title.trim(),
        description: description.trim(),
      });
      //SEND WEB PUSH NOTIFICATION
      await webPushNotif(title.trim(), "", description.trim());
      return NextResponse.json({ msg: "OK" });
    }
    //IMAGE
    case "image": {
      //IMG FILTER
      if(description && description.length > 500) return NextResponse.json({ err: "LARGE DESCRIPTION" });
      function filter(file) {
        if (!file || file.size > 15000000) return NextResponse.json({ err: "BIG OR EMPTY IMAGE" });
        if (!/^image\/(png|jpeg|jpg|gif|avif|webp|bmp)$/i.test(file.type)) return NextResponse.json({ err: "BAD TYPE IMAGE" });
        return true;
      }
      if (filter(image)) {
        //START PROCESS
        const binary = await file.arrayBuffer();
        const buffer = Buffer.from(binary);

        const url = await new Promise((resolve, reject) => {
          cloudinary.uploader
            .upload_stream({}, (err, res) => {
              if (err) return reject(err);
              if (res) return resolve(res.secure_url);
            })
            .end(buffer);
        });

        //SAVE PUB TO DB
        await Pubs.create({
          author: user.name,
          avatar: imgDB,
          title: title.trim(),
          description: description.trim(),
          image: url,
        });
        //SEND WEB PUSH NOTIFICATION
        await webPushNotif(title.trim(), url, description.trim());

        return NextResponse.json({ msg: "OK" });
      }
      break;
    }
    //VIDEO
    case "video": {
      if (!data.get("yt")) NextResponse.json({ err: "EMPTY" });
      const yt_id = get_video_id(data.get("yt").trim());
      if (!yt_id) NextResponse.json({ err: "BAD URL" });
      //SAVE TO DB
      await Pubs.create({
        author: user.name,
        avatar: imgDB,
        title: data.get("title").trim(),
        yt: yt_id,
      });

      return NextResponse.json({ msg: "OK" });
    }
    //AUDIO
    case "audio": {
      if(description && description.length > 500) return NextResponse.json({ err: "LARGE DESCRIPTION" });
      //FILTER AUDIO FILE
      async function filter(file) {
        if (!file || file.size > 15000000) return NextResponse.json({ err: "BIG OR EMPTY AUDIO" });
        if (!/^audio\/(mp3|mpeg|ogg|wav|aac|webm|midi)$/i.test(file.type)) return NextResponse.json({ err: "BAD TYPE AUDIO" });
        return true;
      }
      if (filter(audio)) {
        //START PROCESS
        const binary = await audio.arrayBuffer();
        const buffer = Buffer.from(binary);

        const url = await new Promise((resolve, reject) => {
          cloudinary.uploader
            .upload_stream({ resource_type: "auto" }, (err, res) => {
              if (err) return reject(err);
              if (res) return resolve(res.secure_url);
            })
            .end(buffer);
        });

        //SAVE PUB TO DB
        await Pubs.create({
          author: user.name,
          avatar: imgDB,
          title: title.trim(),
          description: description.trim(),
          audio: url,
        });
        //WEBPUSH NOTIFICATION
        await webPushNotif(title.trim(), "", description.trim());
        return NextResponse.json({ msg: "OK" });
      }
      break;
    }
  }

  //BAD
  return NextResponse.json({ status: 403 });
};

export const DELETE = async (req) => {
  //GET SESSION
  const { user } = await getServerSession();
  if (!user) return NextResponse.status(401);
  if(blockeds.includes(user.email)) return NextResponse.json({msg: 'BLOCKED USER'});
  //INIT
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");
  const id = searchParams.get("id");
  //VALIDATE IF AUTHOR OF PUB IS TRUST
  await db();
  const stat = await Pubs.find({
    _id: new Types.ObjectId(id),
    author: user.name,
  });
  if (stat.length == 0) return NextResponse.json({ err: "NO OWNER" });
  await Pubs.findByIdAndDelete(id);
  //DELETE SRC FROM CLOUDYNARI
  if (type == "image" || type == "audio") {
    const src1 = searchParams.get("src");
    if (!src1) return;
    const src2 = src1.replace(/.{4}$/, "");
    cloudinary.uploader.destroy(src2, (err, res) => {
      if (err) return NextResponse.json({ err });
    });
  }
  return NextResponse.json({ msg: "OK" });
};
