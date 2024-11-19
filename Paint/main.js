class PaintApp {
  constructor(canvasId, colorPickerId, lineWidthId, clearButtonId) {
    // Получаем элементы управления
    this.canvas = document.getElementById(canvasId);
    this.colorPicker = document.getElementById(colorPickerId);
    this.lineWidthPicker = document.getElementById(lineWidthId);
    this.clearButton = document.getElementById(clearButtonId);

    // Настройка контекста рисования
    this.ctx = this.canvas.getContext("2d");
    this.ctx.lineCap = "round";
    this.color = this.colorPicker.value;
    this.lineWidth = this.lineWidthPicker.value;

    // Начальное состояние рисования
    this.isDrawing = false;

    // Привязка событий
    this.attachEvents();
  }

  attachEvents() {
    // Начало и завершение рисования
    this.canvas.addEventListener("mousedown", (e) => this.startDrawing(e));
    this.canvas.addEventListener("mouseup", () => this.stopDrawing());
    this.canvas.addEventListener("mousemove", (e) => this.draw(e));
    this.canvas.addEventListener("mouseleave", () => this.stopDrawing());

    // Управление цветом и толщиной линии
    this.colorPicker.addEventListener("change", (e) => this.changeColor(e));
    this.lineWidthPicker.addEventListener("input", (e) => this.changeLineWidth(e));

    // Кнопка очистки
    this.clearButton.addEventListener("click", () => this.clearCanvas());
  }

  startDrawing(event) {
    this.isDrawing = true;
    this.ctx.beginPath();
    this.ctx.moveTo(event.offsetX, event.offsetY);
  }

  stopDrawing() {
    if (this.isDrawing) {
      this.isDrawing = false;
      this.ctx.closePath();
    }
  }

  draw(event) {
    if (!this.isDrawing) return;

    this.ctx.lineTo(event.offsetX, event.offsetY);
    this.ctx.strokeStyle = this.color;
    this.ctx.lineWidth = this.lineWidth;
    this.ctx.stroke();
  }

  changeColor(event) {
    this.color = event.target.value;
  }

  changeLineWidth(event) {
    this.lineWidth = event.target.value;
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
  }
}

// Расширенный класс с функцией заливки
class AdvancedPaintApp extends PaintApp {
  constructor(canvasId, colorPickerId, lineWidthId, clearButtonId, fillButtonId) {
    super(canvasId, colorPickerId, lineWidthId, clearButtonId);

    // Кнопка заливки
    this.fillButton = document.getElementById(fillButtonId);
    this.fillButton.addEventListener("click", () => this.fillShape());
  }

  fillShape() {
    // Устанавливаем цвет заливки и заливаем текущую фигуру
    this.ctx.fillStyle = this.color;
    this.ctx.fill();
  }
}

class ExtendedPaintApp extends AdvancedPaintApp {
    constructor(canvasId, colorPickerId, lineWidthId, clearButtonId, fillButtonId, downloadButtonId, uploadButtonId) {
      super(canvasId, colorPickerId, lineWidthId, clearButtonId, fillButtonId);
  
      // Кнопки для скачивания и загрузки изображения
      this.downloadButton = document.getElementById(downloadButtonId);
      this.uploadButton = document.getElementById(uploadButtonId);
  
      // Привязка событий для скачивания и загрузки изображения
      this.downloadButton.addEventListener("click", () => this.downloadImage());
      this.uploadButton.addEventListener("change", (e) => this.uploadImage(e));
    }
  
    downloadImage() {
      const link = document.createElement("a");
      link.download = "my_drawing.png"; // Имя скачиваемого файла
      link.href = this.canvas.toDataURL("image/png"); // Получение изображения из canvas в формате PNG
      link.click();
    }
  
    uploadImage(event) {
      const file = event.target.files[0];
      if (!file) return;
  
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          // Очистка canvas и отображение загруженного изображения
          this.clearCanvas();
          this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }
  
  class InteractiveShapePaintApp extends ExtendedPaintApp {
    constructor(canvasId, colorPickerId, lineWidthId, clearButtonId, fillButtonId, downloadButtonId, uploadButtonId, shapeButtons) {
      super(canvasId, colorPickerId, lineWidthId, clearButtonId, fillButtonId, downloadButtonId, uploadButtonId);
  
      this.selectedShape = null; // Текущая выбранная фигура
      this.isDrawingShape = false; // Флаг для рисования фигуры
      this.startX = 0; // Начальные координаты
      this.startY = 0;
      this.shapes = []; // Массив для хранения всех фигур
  
      // Привязка кнопок для выбора фигур
      this.shapeButtons = shapeButtons;
      this.attachShapeEvents();
    }
  
    attachShapeEvents() {
      // Назначаем обработчик для каждой кнопки фигуры
      this.shapeButtons.square.addEventListener("click", () => this.selectShape("square"));
      this.shapeButtons.circle.addEventListener("click", () => this.selectShape("circle"));
      this.shapeButtons.triangle.addEventListener("click", () => this.selectShape("triangle"));
      
      // Привязка событий для canvas
      this.canvas.addEventListener("mousedown", (e) => this.startShape(e));
      this.canvas.addEventListener("mousemove", (e) => this.resizeShape(e));
      this.canvas.addEventListener("mouseup", () => this.finishShape());
    }
  
    selectShape(shape) {
      this.selectedShape = shape; // Выбираем тип фигуры
    }
  
    startShape(event) {
      if (!this.selectedShape) return; // Если фигура не выбрана, не рисуем
  
      this.isDrawingShape = true;
      this.startX = event.offsetX;
      this.startY = event.offsetY;
    }
  
    resizeShape(event) {
      if (!this.isDrawingShape) return;
  
      const currentX = event.offsetX;
      const currentY = event.offsetY;
      const width = currentX - this.startX;
      const height = currentY - this.startY;
  
      // Очищаем и перерисовываем canvas
      this.clearCanvas();
      this.redrawCanvasContent();
  
      this.ctx.strokeStyle = this.color;
      this.ctx.lineWidth = this.lineWidth;
  
      // Временно рисуем текущую фигуру
      switch (this.selectedShape) {
        case "square":
          this.drawSquare(this.startX, this.startY, width, height);
          break;
        case "circle":
          this.drawCircle(this.startX, this.startY, width, height);
          break;
        case "triangle":
          this.drawTriangle(this.startX, this.startY, width, height);
          break;
      }
    }
  
    finishShape() {
      if (this.isDrawingShape) {
        this.isDrawingShape = false;
  
        const width = event.offsetX - this.startX;
        const height = event.offsetY - this.startY;
  
        // Сохраняем текущую фигуру в массив
        this.shapes.push({
          type: this.selectedShape,
          x: this.startX,
          y: this.startY,
          width: width,
          height: height,
          color: this.color,
          lineWidth: this.lineWidth,
        });
  
        // Перерисовываем canvas с добавленной фигурой
        this.clearCanvas();
        this.redrawCanvasContent();
  
        this.selectedShape = null; // Сброс выбора фигуры
      }
    }
  
    drawSquare(x, y, width, height) {
      this.ctx.strokeRect(x, y, width, height);
    }
  
    drawCircle(x, y, width, height) {
      const radius = Math.sqrt(width ** 2 + height ** 2) / 2;
      this.ctx.beginPath();
      this.ctx.arc(x + width / 2, y + height / 2, radius, 0, Math.PI * 2);
      this.ctx.stroke();
    }
  
    drawTriangle(x, y, width, height) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, y);
      this.ctx.lineTo(x + width, y);
      this.ctx.lineTo(x + width / 2, y - height);
      this.ctx.closePath();
      this.ctx.stroke();
    }
  
    redrawCanvasContent() {
      // Перерисовываем все сохранённые фигуры
      this.shapes.forEach(shape => {
        this.ctx.strokeStyle = shape.color;
        this.ctx.lineWidth = shape.lineWidth;
  
        switch (shape.type) {
          case "square":
            this.drawSquare(shape.x, shape.y, shape.width, shape.height);
            break;
          case "circle":
            this.drawCircle(shape.x, shape.y, shape.width, shape.height);
            break;
          case "triangle":
            this.drawTriangle(shape.x, shape.y, shape.width, shape.height);
            break;
        }
      });
    }
  }
  
  class BezierPaintApp extends InteractiveShapePaintApp {
    constructor(canvasId, colorPickerId, lineWidthId, clearButtonId, fillButtonId, downloadButtonId, uploadButtonId, shapeButtons, bezierButtonId) {
      super(canvasId, colorPickerId, lineWidthId, clearButtonId, fillButtonId, downloadButtonId, uploadButtonId, shapeButtons);
  
      this.controlPoints = [];
      this.bezierCurves = []; // Сохраняем все кривые Безье
      this.bezierMode = false;
      this.selectedPoint = null;
  
      // Кнопка для активации режима рисования кривых Безье
      this.bezierButton = document.getElementById(bezierButtonId);
      this.bezierButton.addEventListener("click", () => this.toggleBezierMode());
  
      // Привязка событий мыши для установки и перетаскивания точек
      this.canvas.addEventListener("mousedown", (e) => this.onMouseDown(e));
      this.canvas.addEventListener("mousemove", (e) => this.onMouseMove(e));
      this.canvas.addEventListener("mouseup", () => this.onMouseUp());
  
      // Модификация кнопки очистки для очистки всех объектов
      this.clearButton.addEventListener("click", () => this.clearAll());
    }
  
    toggleBezierMode() {
      this.bezierMode = !this.bezierMode;
  
      if (this.controlPoints.length === 3) {
        // Добавляем готовую кривую в массив, если все три точки заданы
        this.bezierCurves.push([...this.controlPoints]);
        this.controlPoints = [];
      }
      this.selectedPoint = null;
      this.redrawCanvas();
    }
  
    onMouseDown(event) {
      const x = event.offsetX;
      const y = event.offsetY;
  
      if (this.bezierMode) {
        if (this.controlPoints.length === 3) {
          // Проверка нажатия на существующую точку
          this.selectedPoint = this.controlPoints.find(point => this.isPointClicked(point, x, y));
        } else {
          this.controlPoints.push({ x, y });
        }
        this.redrawCanvas();
      } else {
        super.onMouseDown(event); // Обработка обычных фигур
      }
    }
  
    onMouseMove(event) {
      if (this.selectedPoint) {
        this.selectedPoint.x = event.offsetX;
        this.selectedPoint.y = event.offsetY;
        this.redrawCanvas();
      }
    }
  
    onMouseUp() {
      this.selectedPoint = null;
    }
  
    isPointClicked(point, x, y) {
      const radius = 5;
      return Math.abs(point.x - x) < radius && Math.abs(point.y - y) < radius;
    }
  
    drawBezierCurve(points) {
      if (points.length < 3) return;
  
      const [p0, p1, p2] = points;
      this.ctx.beginPath();
      this.ctx.moveTo(p0.x, p0.y);
      this.ctx.quadraticCurveTo(p1.x, p1.y, p2.x, p2.y);
      this.ctx.strokeStyle = this.color;
      this.ctx.lineWidth = this.lineWidth;
      this.ctx.stroke();
  
      points.forEach(point => {
        this.ctx.beginPath();
        this.ctx.arc(point.x, point.y, 5, 0, Math.PI * 2);
        this.ctx.fillStyle = "blue";
        this.ctx.fill();
      });
    }
  
    redrawCanvas() {
      super.clearCanvas();
      // Рисуем все сохраненные кривые Безье
      this.bezierCurves.forEach(curve => this.drawBezierCurve(curve));
      // Рисуем текущую кривую, если она есть
      if (this.controlPoints.length === 3) {
        this.drawBezierCurve(this.controlPoints);
      }
    }
  
    clearAll() {
      // Очищаем содержимое canvas
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
      // Очищаем массивы и сбрасываем точки/фигуры
      this.shapes = [];
      this.controlPoints = [];
      this.bezierCurves = [];
    
      // Сбрасываем текущую выбранную точку
      this.selectedPoint = null;
    
      // Перерисовываем canvas
      this.redrawCanvasContent();
    }
    
  }
  
  // Инициализация приложения с поддержкой кривых Безье
  document.addEventListener("DOMContentLoaded", () => {
    new BezierPaintApp(
      "paintCanvas",
      "colorPicker",
      "lineWidth",
      "clearCanvas",
      "fillShapeButton",
      "downloadButton",
      "uploadButton",
      {
        square: document.getElementById("drawSquareButton"),
        circle: document.getElementById("drawCircleButton"),
        triangle: document.getElementById("drawTriangleButton"),
      },
      "bezierButton"
    );
  });
  