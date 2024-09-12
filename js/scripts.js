/*Nombre del método: requestNotificationPermission() */
const requestNotificationPermission = async () =>{
    const permission = await Notification.requestPermission();
    if(permission !== 'granted'){
        throw new Error("No se ha podido otorgar permisos para la notificación");
    }else{
        new Notification("Hola, mi nombre es Jaime Jeovanny Cortez Flores");
    }
}


function geolocalizacion(){
    if(navigator.permissions && navigator.permissions.query){
        navigator.permissions.query({name:'geolocation'}).then(function(result){
            const permission = result.state;
            if(permission === 'granted' || permission === 'prompt'){
                obtenergeolocalizacion();
            }
        });
    }else if(navigator.geolocation){
        obtenergeolocalizacion();
    }
}

function obtenergeolocalizacion(){
    const options = {
        precision: true,
        timeout: 5000,
        maximunage: 0
    };

    navigator.geolocation.getCurrentPosition(function(position){

        const marcador = {
            lat: position.coords.latitude,
            long: position.coords.longitude
        };

        let enlace = document.getElementById("ir_mapa");
        enlace.href = `https://maps.google.com/?q=${marcador.lat},${marcador.long}`;
        enlace.target = "_blank";
        enlace.text = "Ir al mapa";

    },function(error){
        throw new Error("Hubo un error");
    },options);

}


async function recordVideo(){

	if (window.recorder && window.recorder.state === "recording"){
		window.recorder.stop();
	}else {
		let toggle = document.getElementById('recording-button');
		
		//we request permission to access the device's microphone and camera
		//let stream = await navigator.mediaDevices.getUserMedia({audio: true, video: true });
		let stream = await navigator.mediaDevices.getUserMedia({audio: true, video: true })
		.catch((error)=>{
			throw new Error("No es posible continuar, debido a que no se han brindado permisos a la aplicación");
		});

		//then we add that stream to our <video> element
		let videoEl = document.getElementById('video-element');
		videoEl.srcObject = stream;
		videoEl.play();

		//next, we need to actively record that stream
		window.recorder = new MediaRecorder(stream);

		//whenever new data has been recorded, we add it to an array of chunks
		let chunks = [];
		window.recorder.ondataavailable = function(event){
		if (event.data.size <= 0) {return;}
			chunks.push(event.data);
		};

		window.recorder.onstop = function(){
		
			//when the recording is over, we take all these chunks of video/audio, then create a blob with it
			//see: https://developer.mozilla.org/en-US/docs/Web/API/Blob
			let blob = new Blob(chunks, { type: 'video/mp4' });

			//we change our "stop" button back to a "record" button
			toggle.innerHTML = `<i class="fa fa-circle"></i>`;
			
			//we replace the source of the video object by removing the stream we added to it earlier
			//and instead we use the URL of the blob we just created with all the recorded chunks -- this will allow our <video> element to play our recorded video
			videoEl.srcObject = null;
			videoEl.src = URL.createObjectURL(blob);

			//last but not least, we tell the browser we don't need access to the user's camera and microphone anymore
			let tracks = stream.getTracks();
			tracks.forEach(track => track.stop());
		};

		//below is just a helper function to change the record button to a stop button
		window.recorder.onstart = function(){
			toggle.innerHTML = `<i class="fa fa-square"></i>`;
		};

		window.recorder.start();
	}
	
}