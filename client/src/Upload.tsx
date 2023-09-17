import React, { useRef, useState } from "react";
import { upload } from "@spheron/browser-upload";
import "./Upload.css";

function Upload() {
  const [isLoading, setIsLoading] = useState(false);
  const [uploadLink, setUploadLink] = useState("");
  const [dynamicLink, setDynamicLink] = useState("");
  const [nftNumber, setNftNumber] = useState<number | null>(null);
  const [bio, setBio] = useState("");
  const [name, setName] = useState("");

  const handleNftNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const enteredNumber = event.target.value ? parseInt(event.target.value) : null;
    setNftNumber(enteredNumber);
  };
  
  const handleBioChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setBio(event.target.value);
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleUpload = async () => {
    if (!nftNumber || !bio || !name) {
      alert("Please enter an NFT number, name and biography");
      return;
    }
  
    const profilePicUrl = `https://rowant.co/tweak/${nftNumber.toString()}.png`;
  
    const htmlContent = `
    <html>
    <head>
        <title>Profile Page</title>
        <style>
            body {
                background-color: #f4f4f4;
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 0;
            }
            .container {
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
            }
            .profile-card {
                background: linear-gradient(to bottom right, #fff, #f2f2f2);
                border-radius: 10px;
                box-shadow: 0 4px 8px rgba(0,0,0,0.1);
                overflow: hidden;
                width: 80%;
                max-width: 800px;
                display: flex;
                flex-direction: row;
            }
            .profile-photo {
                flex: 1;
                max-width: 600px;
            }
            .profile-photo img {
                border-radius: 5px 0 0 5px;
                width: 100%;
                max-width: 600px;
                height: auto;
            }
            .profile-info {
                flex: 2;
                padding: 20px;
            }
            .name {
                font-size: 36px;
                color: #333;
            }
            .bio {
                margin-top: 20px;
                font-size: 16px;
                color: #555;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="profile-card">
                <div class="profile-photo">
                    <img src="${profilePicUrl}" alt="Profile Picture">
                </div>
                <div class="profile-info">
                    <div class="name">${name}</div>
                    <div class="bio">${bio}</div>
                </div>
            </div>
        </div>
    </body>
    </html>
    `;
  
    const htmlFile = new File([htmlContent], "index.html", {type : 'text/html'});
  
    try {
      setIsLoading(true);
      const response = await fetch("https://fleek0.rowant.co:80/initiate-upload");
      const responseJson = await response.json();
      const uploadResult = await upload([htmlFile], {
        token: responseJson.uploadToken,
      });
  
      setUploadLink(uploadResult.protocolLink);
      setDynamicLink(uploadResult.dynamicLinks[0]);
    } catch (err) {
      alert(err);
    } finally {
      setIsLoading(false);
    }
  };

  const reformatLink = (link: string) => {
    const hash = link.split('//')[1].split('.')[0];
    return `ipfs://${hash}`;
  };

  return (
    <div className="App">
    <header className="App-header">
        {isLoading ? (
        <div className="uploading-text">Uploading...</div>
        ) : (
        <>
            <p className="title-text">Face Fables :)</p>
            <div className="flex-container">
            <div className="input-container">
                <label className="styled-label" htmlFor="nftNumber">
                Enter NFT Number
                <input
                    id="nftNumber"
                    type="number"
                    min="1"
                    max="9999"
                    onChange={handleNftNumberChange}
                    className="styled-input"
                />
                </label>
                <div className="name-container">
                <label className="styled-label" htmlFor="name">Name your NFT:</label>
                <input id="name" onChange={handleNameChange} className="styled-input" />
                </div>
                <div className="bio-container">
                <label className="styled-label" htmlFor="bio">Biography:</label>
                <textarea id="bio" onChange={handleBioChange} className="styled-textarea"></textarea>
                </div>
            </div>
            <div className="button-container">
                <button
                className="styled-button"
                onClick={handleUpload}
                >
                Upload
                </button>
                {uploadLink && (
                <a
                    className="upload-link"
                    href={uploadLink}
                    target="__blank"
                >
                    VIEW UPLOAD
                </a>
                )}
                {uploadLink && (
                <a
                    className="upload-link"
                    href={reformatLink(uploadLink)}
                    target="__blank"
                >
                    <b>Copy this link to your subdomain content hash in the ENS app : <br /></b>
                    {reformatLink(uploadLink)}
                </a>
                )}
            </div>
            </div>
        </>
        )}
    </header>
</div>
  );  
}

export default Upload;
