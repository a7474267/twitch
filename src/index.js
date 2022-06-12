import $ from "jquery";
import "normalize.css";
import img from "./img/bg-default.jpg";
import img1 from "./img/twitch.jpg";
import img2 from "./img/ProfilePictureMaker.png";
import "./style.scss";

const axios = require("axios");
const CLIENT_ID = "bv8nmi6sgkny98n75ptkfj8hbl3t41";
const oauthID = "zzpodhoh8fxz5gfxlcmvugsbzn2mhm";

function getUserProfile(data) {
  let userProfiles = [];
  for (let item of data) {
    axios
      .get(`https://api.twitch.tv/helix/users?id=${item.user_id}`, {
        headers: {
          Authorization: "Bearer " + oauthID,
          "Client-Id": CLIENT_ID,
        },
      })
      .then((res) => {
        userProfiles.push(res.data.data[0].profile_image_url);
      })
      .then(() => {
        data.forEach(
          (item, index) => (item.profile_image_url = userProfiles[index])
        );
      });
  }
  return data;
}

async function getData() {
  const data = await axios.get(
    "https://api.twitch.tv/helix/streams?game_id=21779",
    {
      headers: {
        Authorization: "Bearer " + oauthID,
        "Client-Id": CLIENT_ID,
      },
    }
  );
  const newData = await getUserProfile(data.data.data);
  console.log(newData);
  displayData(newData);
}

function displayData(data) {
  let dom = "";
  for (let item of data) {
    dom += `
    <li class="channel-list">
      <div class="channel-banner"></div>
      <div class="channel-info">
        <div class="channel-photo">
          <img src="${item.profile_image_url}" alt=""></div>
        <div class="channel-content">
          <p class="channel-name">頻道名稱</p>
          <p class="channel-owner">實況主: ${item.user_name}</p>
        </div>
      </div>
    </li>`;
  }
  $(".twitch-channel").append(dom);
}

getData();
