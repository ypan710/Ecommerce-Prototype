import React, { useState, useRef } from 'react';
import axios from 'axios';
import Clipper from 'image-clipper';

const ResizeImage = () => {

    const [imageSrc, setImageSrc] = useState('');
    const [fileInfo, setFileInfo] = useState();
    const imgEl = useRef(null);

    // Define function to run when the input receives a file
    function handleFileInput(e) {

        // Saves the info about the file
        setFileInfo(e.target.files[0]);

        // Create the url path for image to display in chrome
        const src = URL.createObjectURL(e.target.files[0]);
        setImageSrc(src);
    }

    // Resize the image to 100x100
    const resizeImage100 = () => {
        Clipper(imgEl.current, function() {
            this
            .resize(100, 100)
            .quality(100)
            .toDataURL(dataUrl => {
                setImageSrc(dataUrl)
                this.toDataURL(original => {

                    // request to send to mongoDB
                    axios.post('/listing/upload_resized', {
                        original,
                        resized: dataUrl,
                        dimension: 100
                    })
                    .then((res) => {
                        console.log("Success: ", res);
                    })
                    .catch((err) => {
                        console.log("Fail: ", err);
                    })
                    // request to send to kafka
                    axios.post('/listing/kafka_send', {
                        original,
                        resized: dataUrl,
                        dimension: 500
                    })
                    .then((res) => {
                        console.log("Success: ", res);
                    })
                    .catch((err) => {
                        console.log("Fail: ", err);
                    })
                })



            });
        });
    }

    // Resize the image to 500x500 (may need to reduce image size)
    const resizeImage500 = () => {
        Clipper(imgEl.current, function() {
            this
            .resize(500, 500)
            .quality(100)
            .toDataURL(dataUrl => {
                setImageSrc(dataUrl)
                this.toDataURL(original => {
                    // request to send to mongoDB
                    axios.post('/listing/upload_resized', {
                        original,
                        resized: dataUrl,
                        dimension: 500
                    })
                    .then((res) => {
                        console.log("Success: ", res);
                    })
                    .catch((err) => {
                        console.log("Fail: ", err);
                    })
                    // request to send to kafka
                    axios.post('/listing/kafka_send', {
                        original,
                        resized: dataUrl,
                        dimension: 500
                    })
                    .then((res) => {
                        console.log("Success: ", res);
                    })
                    .catch((err) => {
                        console.log("Fail: ", err);
                    })
                })

                
                


            });
        });
    }

    return (
        <div>
            <div className="box">
                <h1>Resize an Image Here!</h1>
                <p>Attach an image:</p>
                <p><input onChange={handleFileInput}
                        type="file"
                        id="fileupload"
                        accept="image/jpeg, image/gif, image/png"/></p>
                <img ref={imgEl} src={imageSrc}/>
                <br/>
                <button onClick={resizeImage100} type="submit">
                    Resize to 100x100
                </button>
                <button onClick={resizeImage500} type="submit">
                    Resize to 500x500
                </button>
            </div>
        </div>
    );
};

export default ResizeImage;
