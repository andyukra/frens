import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import Pubs from '@/lib/models/pubs';
import Users from '@/lib/models/users';
import { auth } from "@/auth";
import { v2 as cloudinary } from "cloudinary";
import blockeds from '@/lib/blocked';
import { revalidateTag } from 'next/cache';
//CLOUDYNARI CREDENTIALS
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
});

//HELPERS
function filterImg(x) {
    if(x.size > 4000000 || !/^image/.test(x.type)) return NextResponse.json({err: 'BAD FILE'});
}

export async function POST(req) {
    const { user } = await auth();
    if(!user) return NextResponse.json({status: 403});
    if(blockeds.includes(user.email)) return NextResponse.json({msg: 'BLOCKED USER'});
    const data = await req.formData();

    const file = data.get('file');
    const comment = data.get('comment');
    const id = data.get('id');

    if(!id) return NextResponse.json({err: 'BAD ID'});
    if(!file && !comment) return NextResponse.json({err: 'BAD EMPTY COMMENT'});
    if(comment && comment.length > 500) return NextResponse.json({err: 'BAD LARGE COMMENT'});

    //FOR COMMENTS
    if(comment) { 
        await db();
        const { image: imgDB } = await Users.findOne({email: user.email}, {image: 1, _id: 0}).lean();
        await Pubs.updateOne({_id:id}, { $push: {comments: {
            author: user.name,
            avatar: imgDB,
            msg: comment.trim()
        }} });

        //REVALIDATE CACHE
        revalidateTag("pubsPage-1");

        return NextResponse.json({msg: 'OK', comment: comment.trim()});
    }

    //FOR FILES
    if(file) {
        filterImg(file);
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

        await db();
        const { image: imgDB } = await Users.findOne({email: user.email}, {image: 1, _id: 0}).lean();
        await Pubs.updateOne({_id:id}, { $push: {comments: {
            author: user.name,
            avatar: imgDB,
            msg: url
        }} });

        //REVALIDATE CACHE
        revalidateTag("pubsPage-1");

        return NextResponse.json({msg: 'OK', comment: url});

    }

}