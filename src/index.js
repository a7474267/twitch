import $ from "jquery";
import "normalize.css";
import img from "./img/bg-default.jpg";
import img1 from "./img/twitch.jpg";
import img2 from "./img/ProfilePictureMaker.png";
import "./style.scss";

const axios = require("axios");
const CLIENT_ID = "bv8nmi6sgkny98n75ptkfj8hbl3t41";
const oauthID = "s404nz1r9e53k3b3j0mc44mo5e5l3q";

function getRawData() {
  return new Promise(function (resolve, reject) {
    axios
      .get("https://api.twitch.tv/helix/streams?game_id=21779", {
        headers: {
          Authorization: "Bearer " + oauthID,
          "Client-Id": CLIENT_ID,
        },
      })
      .then((res) => {
        resolve(res.data.data);
      });
  });
}

function getStreamerProfile(data) {
  return new Promise(function (resolve, reject) {
    let userProfiles = [];
    let promiseArr = [];
    for (let item of data) {
      promiseArr.push(
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
      );
    }
    Promise.all(promiseArr).then(() => {
      data.forEach(
        (item, index) => (item.profile_image_url = userProfiles[index])
      );
      resolve(data);
    });
  });
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

async function getSreamData() {
  const rawData = await getRawData();
  const newData = await getStreamerProfile(rawData);
  displayData(newData);
}

getSreamData();
