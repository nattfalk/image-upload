var ImageDrop = /** @class */ (function () {
    function ImageDrop(options) {
        var _this = this;
        this._opts = options;
        var dropEl = this._opts.dropElement;
        dropEl.addEventListener("dragenter", this.dragEnter);
        dropEl.addEventListener("dragover", this.dragOver);
        dropEl.addEventListener("dragend", this.dragEnd);
        dropEl.addEventListener("dragleave", this.dragEnd);
        dropEl.addEventListener("drop", function (ev) {
            ev.preventDefault();
            ev.stopPropagation();
            console.log("drop");
            var el = ev.target;
            if (el.classList.contains(ImageDrop.DRAG_ACTIVE_CLASSNAME)) {
                el.classList.remove(ImageDrop.DRAG_ACTIVE_CLASSNAME);
            }
            _this.postFile(_this, ev.dataTransfer.files[0]);
        });
        var imgEl = new Image();
        imgEl.src = options.placeholderImage;
        imgEl.addEventListener("click", function () {
            _this.imageClickHandler(_this);
        });
        this._imgEl = imgEl;
        options.dropElement.appendChild(imgEl);
        var inputEl = (document.createElement("input"));
        inputEl.type = "file";
        inputEl.name = "file";
        inputEl.accept = ".png,.jpg,.jpeg";
        inputEl.style.display = "none";
        inputEl.addEventListener("input", function () {
            _this.inputClickHandler(_this);
        });
        this._inputEl = inputEl;
        options.dropElement.appendChild(inputEl);
    }
    ImageDrop.prototype.postFile = function (imgDrop, file) {
        console.log("postfile");
        var formData = new FormData();
        formData.append("imagedata", !!file ? file : imgDrop._inputEl.files[0]);
        formData.append("imageid", imgDrop._opts.imageId);
        fetch(imgDrop._opts.endPoint, {
            method: "POST",
            body: formData,
            headers: {
                Accept: "application/json"
            }
        })
            .then(function (response) { return response.json(); })
            .then(function (result) {
            if (result.Status === true) {
                imgDrop._imgEl.src = result.Url;
            }
            else {
                alert("Couldn not upload image file.");
            }
        })
            .catch(function (error) {
            console.error("Error:", error);
        });
    };
    ImageDrop.prototype.imageClickHandler = function (imgDrop) {
        console.log("image click handler");
        this._inputEl.click();
    };
    ImageDrop.prototype.inputClickHandler = function (imgDrop) {
        console.log("input click handler");
        this.postFile(imgDrop);
    };
    ImageDrop.prototype.dragEnter = function (ev) {
        ev.preventDefault();
        ev.stopPropagation();
        console.log("dragenter");
        var el = ev.target;
        if (!el.classList.contains(ImageDrop.DRAG_ACTIVE_CLASSNAME)) {
            el.classList.add(ImageDrop.DRAG_ACTIVE_CLASSNAME);
        }
    };
    ImageDrop.prototype.dragOver = function (ev) {
        ev.preventDefault();
        ev.stopPropagation();
    };
    ImageDrop.prototype.dragEnd = function (ev) {
        ev.preventDefault();
        ev.stopPropagation();
        console.log("dragend");
        var el = ev.target;
        if (el.classList.contains(ImageDrop.DRAG_ACTIVE_CLASSNAME)) {
            el.classList.remove(ImageDrop.DRAG_ACTIVE_CLASSNAME);
        }
    };
    ImageDrop.DRAG_ACTIVE_CLASSNAME = "imagedrop-drag-active";
    return ImageDrop;
}());
