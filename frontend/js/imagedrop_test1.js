function postFile(file) {
  const formData = new FormData();
  formData.append("imagedata", file);
  formData.append("imageid", "1");
  fetch("http://localhost:8080/upload", {
    method: "POST",
    //mode: "no-cors",
    body: formData,
    headers: {
      Accept: "application/json"
      //"Content-Type": "multipart/form-data",
      //"Access-Control-Allow-Origin": "http://localhost:5500"
    }
  })
    .then(response => response.json())
    .then(result => {
      console.log("Success:", result);

      if (result.Status === true) {
        document.querySelector("img").src = result.Url;
      } else {
        alert("bad file!");
      }
    })
    .catch(error => {
      console.error("Error:", error);
    });
}

function dropFile(ev) {
  ev.preventDefault();
  ev.stopPropagation();

  if (ev.target.classList.contains("drop-dragstart")) {
    ev.target.classList.remove("drop-dragstart");
  }
  console.log(ev.dataTransfer.files[0]);

  postFile(ev.dataTransfer.files[0]);
}

function dragEnter(ev) {
  ev.preventDefault();
  ev.stopPropagation();

  console.log("dragstart");

  if (!ev.target.classList.contains("drop-dragstart")) {
    ev.target.classList.add("drop-dragstart");
    console.log("dragstart added class");
  }
}

function dragEnd(ev) {
  ev.preventDefault();
  ev.stopPropagation();

  if (ev.target.classList.contains("drop-dragstart")) {
    ev.target.classList.remove("drop-dragstart");
  }
}

function dragOver(ev) {
  ev.preventDefault();
  ev.stopPropagation();

  //console.log(e);
}

function inputFileClick() {
  let el = document.querySelector("#inp-test");
  el.click();
}
