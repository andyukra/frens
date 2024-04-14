import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { db } from "@/lib/db";
import Pubs from "@/lib/models/pubs";
import { getServerSession } from "next-auth";
import { Types } from 'mongoose';

//CLOUDYNARI CREDENTIALS
cloudinary.config({
  cloud_name: "andy-company",
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
    return yt_id.replace('?', '');
  }

export const POST = async (req) => {
  //GET SESSION
  const { user } = await getServerSession();
  if (!user) return NextResponse.status(401);
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");
  const data = await req.formData();
  await db();

  //SWITCH TYPE
  switch (type) {
    //TEXT
    case "text": {
      if (!data.get("title") || !data.get("description"))
        NextResponse.json({ err: "EMPTY" });
      await Pubs.create({
        author: user.name,
        avatar: user.image,
        title: data.get("title").trim(),
        description: data.get("description").trim(),
      });
      return NextResponse.json({ msg: "OK" });
    }
    //IMAGE
    case "image": {
      //IMG FILTER
      function filter(file) {
        if (file.size > 15000000) {
          return NextResponse.json({ err: "BIG" });
        }
        if (
          file.type != "image/png" ||
          file.type != "image/jpeg" ||
          file.type != "image/jpg" ||
          file.type != "image/gif"
        ) {
          return NextResponse.json({ err: "BADTYPE" });
        }
        return true;
      }
      const file = data.get("file");
      if (filter(file)) {
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
          avatar: user.image,
          title: data.get("title").trim(),
          description: data.get("description").trim(),
          image: url,
        });

        return NextResponse.json({ msg: "OK" });
      }
      break;
    }
    //VIDEO
    case "video": {
      if (!data.get("yt")) NextResponse.json({ err: "EMPTY" });
      const yt_id = get_video_id(data.get('yt').trim());
      if(!yt_id) NextResponse.json({err: 'BAD URL'})
      //SAVE TO DB
      await Pubs.create({
        author: user.name,
        avatar: user.image,
        title: data.get("title").trim(),
        yt: yt_id,
      });

      return NextResponse.json({ msg: "OK" });
    }
    //AUDIO
    case "audio": {
      //FILTER AUDIO FILE
      function filter(file) {
        if (file.size > 15000000) {
          return NextResponse.json({ err: "BIG" });
        }
        if (
          file.type != "image/mp3" ||
          file.type != "image/wav" ||
          file.type != "image/ogg"
        ) {
          return NextResponse.json({ err: "BADTYPE" });
        }
        return true;
      }
      const audio = data.get("audio");
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
          avatar: user.image,
          title: data.get("title").trim(),
          description: data.get("description").trim(),
          audio: url,
        });

        return NextResponse.json({ msg: "OK" });
      }
      break;
    }
  }

  /**/

  //BAD
  return NextResponse.json({ status: 403 });
};

export const DELETE = async (req) => {
  //GET SESSION
  const { user } = await getServerSession();
  if (!user) return NextResponse.status(401);
  //INIT
  const { searchParams } = new URL(req.url);
  const type = searchParams.get('type');
  const id = searchParams.get('id');
  //VALIDATE IF AUTHOR OF PUB IS TRUST
  await db();
  const stat = await Pubs.find({_id: new Types.ObjectId(id), author: user.name});
  if(stat.length == 0) return NextResponse.json({err: 'NO OWNER'});
  await Pubs.findByIdAndDelete(id);
  //DELETE SRC FROM CLOUDYNARI
  if(type == 'image' || type == 'audio') {
    const src1 = searchParams.get('src');
    if(!src1) return;
    const src2 = src1.replace(/.{4}$/, '');
    cloudinary.uploader.destroy(src2, (err, res) => {
      if(err) return NextResponse.json({err});
    });
  }
  

  return NextResponse.json({msg: 'OK'});

}