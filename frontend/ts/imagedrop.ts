interface ImageDropOptions {
  endPoint: string;
  imageId: string;
  dropElement: HTMLElement;
  placeholderImage: string;
}

class ImageDrop {
  private static DRAG_ACTIVE_CLASSNAME = "imagedrop-drag-active";

  private _opts: ImageDropOptions;
  private _inputEl: HTMLInputElement;
  private _imgEl: HTMLImageElement;

  private postFile(imgDrop: ImageDrop, file?: File): void {
    console.log("postfile");

    const formData = new FormData();
    formData.append("imagedata", !!file ? file : imgDrop._inputEl.files[0]);
    formData.append("imageid", imgDrop._opts.imageId);
    fetch(imgDrop._opts.endPoint, {
      method: "POST",
      body: formData,
      headers: {
        Accept: "application/json"
      }
    })
      .then(response => response.json())
      .then(result => {
        if (result.Status === true) {
          imgDrop._imgEl.src = result.Url;
        } else {
          alert("Couldn not upload image file.");
        }
      })
      .catch(error => {
        console.error("Error:", error);
      });
  }

  private imageClickHandler(imgDrop: ImageDrop): void {
    console.log("image click handler");
    this._inputEl.click();
  }

  private inputClickHandler(imgDrop: ImageDrop): void {
    console.log("input click handler");
    this.postFile(imgDrop);
  }

  private dragEnter(ev: DragEvent): void {
    ev.preventDefault();
    ev.stopPropagation();
    console.log("dragenter");
    let el = <HTMLDivElement>ev.target;
    if (!el.classList.contains(ImageDrop.DRAG_ACTIVE_CLASSNAME)) {
      el.classList.add(ImageDrop.DRAG_ACTIVE_CLASSNAME);
    }
  }

  private dragOver(ev: DragEvent): void {
    ev.preventDefault();
    ev.stopPropagation();
  }

  private dragEnd(ev: DragEvent): void {
    ev.preventDefault();
    ev.stopPropagation();
    console.log("dragend");
    let el = <HTMLDivElement>ev.target;
    if (el.classList.contains(ImageDrop.DRAG_ACTIVE_CLASSNAME)) {
      el.classList.remove(ImageDrop.DRAG_ACTIVE_CLASSNAME);
    }
  }

  constructor(options?: ImageDropOptions) {
    this._opts = options;

    let dropEl = this._opts.dropElement;
    dropEl.addEventListener("dragenter", this.dragEnter);
    dropEl.addEventListener("dragover", this.dragOver);
    dropEl.addEventListener("dragend", this.dragEnd);
    dropEl.addEventListener("dragleave", this.dragEnd);
    dropEl.addEventListener("drop", ev => {
      ev.preventDefault();
      ev.stopPropagation();
      console.log("drop");
      let el = <HTMLDivElement>ev.target;
      if (el.classList.contains(ImageDrop.DRAG_ACTIVE_CLASSNAME)) {
        el.classList.remove(ImageDrop.DRAG_ACTIVE_CLASSNAME);
      }
      this.postFile(this, ev.dataTransfer.files[0]);
    });

    let imgEl: HTMLImageElement = new Image();
    imgEl.src = options.placeholderImage;
    imgEl.addEventListener("click", () => {
      this.imageClickHandler(this);
    });
    this._imgEl = imgEl;
    options.dropElement.appendChild(imgEl);

    let inputEl: HTMLInputElement = <HTMLInputElement>(
      document.createElement("input")
    );
    inputEl.type = "file";
    inputEl.name = "file";
    inputEl.accept = ".png,.jpg,.jpeg";
    inputEl.style.display = "none";
    inputEl.addEventListener("input", () => {
      this.inputClickHandler(this);
    });
    this._inputEl = inputEl;
    options.dropElement.appendChild(inputEl);
  }
}
