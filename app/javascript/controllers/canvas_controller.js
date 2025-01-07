import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["canvas", "noteButton", "drawButton", "noteInput", "noteText"]

  connect() {
    console.log("Canvas controller connected!")
    
    // 1. Grab the 2D context of our canvas
    this.ctx = this.canvasTarget.getContext("2d")
    
    // 2. Create an image in JS and set its source
    this.image = new Image()
    this.image.crossOrigin = "anonymous" // Allow cross-origin images
    this.image.src = this.data.get("imageUrl") // We'll pass in the URL via data attribute
    
    this.image.onload = () => {
      // Once the image is loaded, draw it on the canvas
      console.log("Image loaded!", this.image.width, this.image.height)
      this.canvasTarget.width = this.image.width
      this.canvasTarget.height = this.image.height
      this.ctx.drawImage(this.image, 0, 0)
      console.log("Image drawn on canvas")

      // Add a small delay before forcing a redraw
      setTimeout(() => this.forceRedraw(), 100)
    }
    
    // 3. Initialize mode, color, and event listeners
    this.mode = "note"
    this.isDrawing = false 
    this.notes = []
    this.drawings = [] 
    this.drawingColor = "#0000ff"
    this.notePosition = { x: 0, y: 0 } 
    this.undoStack = [] 

    this.updateButtonStyles()

    this.canvasTarget.addEventListener("mousedown", (e) => this.handleMouseDown(e))
    this.canvasTarget.addEventListener("mousemove", (e) => this.handleMouseMove(e))
    this.canvasTarget.addEventListener("mouseup", () => this.handleMouseUp())
    this.canvasTarget.addEventListener("mouseout", () => this.handleMouseUp())
  }

async saveNote(text, x, y) {
    const url = "/annotations";
    const data = {
      annotation: {
        content: text,
        x_position: x,
        y_position: y,
        annotation_type: "note",
        project_id: this.element.dataset.canvasProjectId
      }
    };
  
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": document.querySelector("[name='csrf-token']").content
        },
        body: JSON.stringify(data)
      });
  
      if (!response.ok) throw new Error("Failed to save annotation");
      const result = await response.json();
      console.log("Annotation saved:", result);
  
      this.undoStack.push({ type: "note", data: result });
    } catch (error) {
      console.error("Error saving annotation:", error);
    }
  }
  
  async saveDrawing(points, color) {
    const url = "/annotations";
    const data = {
      annotation: {
        content: JSON.stringify({ points, color }),
        x_position: points[0][0],
        y_position: points[0][1],
        annotation_type: "drawing",
        project_id: this.element.dataset.canvasProjectId
      }
    };
  
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": document.querySelector("[name='csrf-token']").content
        },
        body: JSON.stringify(data)
      });
  
      if (!response.ok) throw new Error("Failed to save drawing");
      const result = await response.json();
      console.log("Drawing saved:", result);
  
      this.undoStack.push({ type: "drawing", data: result });
    } catch (error) {
      console.error("Error saving drawing:", error);
    }
  }

  setMode(event) {
    this.mode = event.target.dataset.mode
    console.log(`Mode set to: ${this.mode}`)

    if (this.mode === "note") {
      this.canvasTarget.style.cursor = "text"
    } else if (this.mode === "draw") {
      this.canvasTarget.style.cursor = "crosshair"
    }

    this.updateButtonStyles()
  }

  // Update button styles based on the selected mode
  updateButtonStyles() {
    if (this.mode === "note") {
      this.noteButtonTarget.classList.add("ring-2", "ring-offset-2", "ring-blue-500")
      this.drawButtonTarget.classList.remove("ring-2", "ring-offset-2", "ring-green-500")
    } else if (this.mode === "draw") {
      this.drawButtonTarget.classList.add("ring-2", "ring-offset-2", "ring-green-500")
      this.noteButtonTarget.classList.remove("ring-2", "ring-offset-2", "ring-blue-500")
    }
  }

  setColor(event) {
    this.drawingColor = event.target.value
    console.log(`Drawing color set to: ${this.drawingColor}`)
  }

  clearCanvas() {
    this.notes = []
    this.drawings = []
    this.redrawCanvas()
    console.log("Canvas cleared")
  }

  handleMouseDown(event) {
    const rect = this.canvasTarget.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    if (this.mode === "note") {
      this.notePosition = { x, y }
      this.noteInputTarget.style.left = `${event.clientX}px`
      this.noteInputTarget.style.top = `${event.clientY}px`
      this.noteInputTarget.classList.remove("hidden")
      this.noteTextTarget.focus()
    } else if (this.mode === "draw") {
      this.isDrawing = true
      this.drawings.push({ type: "path", color: this.drawingColor, points: [[x, y]] })
    }
  }

  handleMouseMove(event) {
    if (this.mode === "draw" && this.isDrawing) {
      const rect = this.canvasTarget.getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top
      const currentPath = this.drawings[this.drawings.length - 1]
      currentPath.points.push([x, y])

      this.redrawCanvas()
    }
  }

  handleMouseUp() {
    if (this.mode === "draw" && this.isDrawing) {
      const currentPath = this.drawings[this.drawings.length - 1]
      this.saveDrawing(currentPath.points, currentPath.color)
    }
    this.isDrawing = false
  }

  submitNote() {
    const text = this.noteTextTarget.value.trim()
    if (text) {
      this.notes.push({ text, x: this.notePosition.x, y: this.notePosition.y })
      this.saveNote(text, this.notePosition.x, this.notePosition.y)
      this.redrawCanvas()
    }
    this.cancelNote()
  }

  cancelNote() {
    this.noteTextTarget.value = ""
    this.noteInputTarget.classList.add("hidden")
  }

  redrawCanvas() {
    this.ctx.clearRect(0, 0, this.canvasTarget.width, this.canvasTarget.height)
    
    this.ctx.drawImage(this.image, 0, 0)
    
    this.notes.forEach((note) => {
      this.ctx.font = "16px sans-serif"
      this.ctx.fillStyle = "white"
      this.ctx.strokeStyle = "black"
      this.ctx.lineWidth = 2

      const textWidth = this.ctx.measureText(note.text).width
      const padding = 8
      const rectX = note.x - padding
      const rectY = note.y - 16 - padding
      const rectWidth = textWidth + 2 * padding
      const rectHeight = 16 + 2 * padding

      const imageData = this.ctx.getImageData(note.x, note.y, 1, 1).data
      const brightness = (imageData[0] + imageData[1] + imageData[2]) / 3
      const bgColor = brightness > 128 ? "rgba(0, 0, 0, 0.7)" : "rgba(255, 255, 255, 0.7)"
      const textColor = brightness > 128 ? "white" : "black"

      this.ctx.fillStyle = bgColor
      this.ctx.fillRect(rectX, rectY, rectWidth, rectHeight)

      this.ctx.fillStyle = textColor
      this.ctx.shadowColor = "rgba(0, 0, 0, 0.5)"
      this.ctx.shadowBlur = 2
      this.ctx.shadowOffsetX = 1
      this.ctx.shadowOffsetY = 1
      this.ctx.fillText(note.text, note.x, note.y)
    })

    this.drawings.forEach((drawing) => {
      if (drawing.type === "path") {
        this.ctx.strokeStyle = drawing.color
        this.ctx.lineWidth = 2
        this.ctx.beginPath()
        drawing.points.forEach((point, index) => {
          if (index === 0) {
            this.ctx.moveTo(point[0], point[1])
          } else {
            this.ctx.lineTo(point[0], point[1])
          }
        })
        this.ctx.stroke()
      }
    })
  }

  forceRedraw() {
    console.log("Canvas redraw")
    requestAnimationFrame(() => {
      this.ctx.clearRect(0, 0, this.canvasTarget.width, this.canvasTarget.height)
      this.ctx.drawImage(this.image, 0, 0)
    })
  }

    downloadCanvas() {
        const timestamp = new Date().toISOString().replace(/[:.]/g, "-") // Format: YYYY-MM-DDTHH-MM-SS-SSS
    
        const fileName = `marked-up-image-${timestamp}.png`
    
        const dataURL = this.canvasTarget.toDataURL("image/png")
    
        const base64Data = dataURL.split(",")[1]
    
        fetch("/save_canvas", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-CSRF-Token": document.querySelector("[name='csrf-token']").content,
        },
        body: JSON.stringify({
            image: base64Data,
            filename: fileName,
            project_id: this.element.dataset.canvasProjectId,
        }),
        })
        .then((response) => response.json())
        .then((data) => {
            if (data.success) {
            // Trigger the download for the user
            const link = document.createElement("a")
            link.href = dataURL
            link.download = fileName
            link.click()
            } else {
            console.error("Failed to save the image on the server.")
            }
        })
        .catch((error) => {
            console.error("Error saving the image:", error)
        })
    }
}