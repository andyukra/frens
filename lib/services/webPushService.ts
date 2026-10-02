const ONESIGNAL_API_KEY = process.env.ONESIGNAL_API_KEY;
const ONESIGNAL_APP_ID = process.env.ONESIGNAL_APP_ID;

export async function webPushNotif(title: string, imgSrc: string, desc: string) {
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
	  chrome_web_icon:
		"https://res.cloudinary.com/dtloj3d2a/image/upload/v1788990890/jppnmbmtjw3xywdepml6.png",
	  chrome_web_badge:
		"https://res.cloudinary.com/dtloj3d2a/image/upload/v1788990890/jppnmbmtjw3xywdepml6.png",
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