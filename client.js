let fetchResult;
i = 0;
const avengersNames = ['Thor', 'Cap', 'Tony Stark', 'Black Panther', 'Black Widow', 'Hulk', 'Spider-Man'];
let randomName = avengersNames[Math.floor(Math.random() * avengersNames.length)];
//]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]


var myHeaders = new Headers();
myHeaders.append("Cache-Control", "no-cache");
myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
myHeaders.append("accept", "application/json");
myHeaders.append("Authorization", "Basic QTVYWDVVTzFKV3lmQmZkeV9LQmp1UT09Okx1R0M5MFlEZGRwSzZIVE1oRWhUVi00SlVhbDdUU1dIMTRPSFVJemJSakE9");

var urlencoded = new URLSearchParams();
urlencoded.append("grant_type", "client_credentials");

var requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: urlencoded,
  redirect: 'follow'
};

fetch("https://api.dolby.io/v1/auth/token?A5XX5UO1JWyfBfdy_KBjuQ%3D%3D=LuGC90YDddpK6HTMhEhTV-4JUal7TSWH14OHUIzbRjA=", requestOptions)
  .then(response => response.text())
  .then(result => { fetchResult = result, abc() })
  .catch(error => console.log('error', error));




//]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]

function abc() {
  let fetchResultJSON = JSON.parse(fetchResult);
  let BearerToken = fetchResultJSON.access_token;
  // console.log("Bearer", fetchResultJSON.access_token);

  authorizationBearer = `Bearer ${BearerToken}`;
  // console.log(authorizationBearer);
  let clientAccessToken;
  //""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
  const options = {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'Cache-Control': 'no-cache',
      'Content-Type': 'application/json',
      authorization: authorizationBearer
    },
    body: JSON.stringify({ expiresIn: 86400, externalId: userNameFirebase, sessionScope: 'conf:create notifications:set' })
  };

  fetch('https://comms.api.dolby.io/v2/client-access-token', options)
    .then(response => response.json())
    .then(response => { clientAccessToken = response.access_token, def() })
    .catch(err => console.error(err));
  //""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""



  function def() {

    // console.log('clienAccessToken',clientAccessToken)
    const main = async () => {
      /* Event handlers */

      // When a stream is added to the conference
      VoxeetSDK.conference.on('streamAdded', (participant, stream) => {
        if (stream.type === 'ScreenShare') {
          return addScreenShareNode(stream);
        }

        if (stream.getVideoTracks().length) {
          // Only add the video node if there is a video track

          addVideoNode(participant, stream);
        }

        addParticipantNode(participant);
      });

      // When a stream is updated
      VoxeetSDK.conference.on('streamUpdated', (participant, stream) => {
        if (stream.type === 'ScreenShare') return;

        if (stream.getVideoTracks().length) {

          // Only add the video node if there is a video track
          addVideoNode(participant, stream);

        } else {
          removeVideoNode(participant);
        }
      });

      // When a stream is removed from the conference
      VoxeetSDK.conference.on('streamRemoved', (participant, stream) => {
        if (stream.type === 'ScreenShare') {
          return removeScreenShareNode();
        }

        removeVideoNode(participant);
        removeParticipantNode(participant);
      });




      try {
        // Initialize the Voxeet SDK
        // Please read the documentation at:
        // https://docs.dolby.io/communications-apis/docs/initializing-javascript
        // Generate a client access token from the Dolby.io dashboard and insert into access_token variable
        let access_token = clientAccessToken;

        VoxeetSDK.initializeToken(access_token, (isExpired) => {
          return new Promise((resolve, reject) => {
            if (isExpired) {
              reject('The access token has expired.');
            } else {
              resolve(access_token);
            }
          });
        });

        // Open a session for the user
        await VoxeetSDK.session.open({ name: randomName });

        // Initialize the UI
        initUI();
      } catch (e) {
        console.log('Something went wrong : ' + e);
      }
    }

    main();
  }
}
