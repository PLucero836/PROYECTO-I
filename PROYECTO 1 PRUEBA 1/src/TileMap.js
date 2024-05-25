//Los import nos importara las clases Pacman, Enemy, y MovingDirection. Esto nos va a permitir usar estas clases dentro de este archivo.
import Pacman from "./Pacman.js";
import Enemy from "./Enemy.js";
import MovingDirection from "./MovingDirection.js";
//Va a definir y exportar la clase TileMap para que pueda ser importada y utilizada en los otros módulos.
export default class TileMap {

  // constructor inicializa la clase TileMap con el tamaño de los mosaico, tilesize el tamaño de  cada mosaico, powerdot inicia el punto de poder y powerDotAnmationTimer establece el temporizador para poder animar los puntos de poder 
  constructor(tileSize) {
    this.tileSize = tileSize;

    this.yellowDot = new Image();
    this.yellowDot.src = "images/yellowDot.png";

    this.pinkDot = new Image();
    this.pinkDot.src = "images/pinkDot.png";

    this.wall = new Image();
    this.wall.src = "images/wall.png";

    this.powerDot = this.pinkDot;
    this.powerDotAnmationTimerDefault = 30;
    this.powerDotAnmationTimer = this.powerDotAnmationTimerDefault;
  }

//Es la estructura del mapa. Los 1 representan las paredes, los 0 los puntos  que se pueden comer, los 7 los puntos de poder y el 4 es Pacman
  map = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 7, 0, 0, 4, 0, 0, 0, 0, 0, 0, 7, 1],
    [1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1],
    [1, 0, 1, 6, 0, 0, 0, 0, 0, 0, 1, 0, 1],
    [1, 0, 1, 7, 1, 1, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1],
    [1, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  ];
//El método draw se utilizará para dibujar el mapa del juego en un contexto de lienzo (ctx). Este método recorre cada celda del mapa (this.map) y, según el valor de cada celda, dibuja un elemento específico en esa posición en el lienzo.
  draw(ctx) {
    for (let row = 0; row < this.map.length; row++) {
      for (let column = 0; column < this.map[row].length; column++) {
        let tile = this.map[row][column];
        if (tile === 1) {
          this.#drawWall(ctx, column, row, this.tileSize);
        } else if (tile === 0) {
          this.#drawDot(ctx, column, row, this.tileSize);
        } else if (tile == 7) {
          this.#drawPowerDot(ctx, column, row, this.tileSize);
        } else {
          this.#drawBlank(ctx, column, row, this.tileSize);
        }
      }
    }
  }
//se utilizará para dibujar un punto comestible en el lienzo del juego. 
//ctx: Este parámetro representa el contexto de dibujo del lienzo en el que se realizará la representación gráfica.
//column y row: Representan las coordenadas donde se dibujará el punto comestible en el mapa. Estas coordenadas se utilizan para calcular la posición en píxeles en el lienzo.
//size: Este parámetro define el tamaño del punto comestible que se dibujará en el lienzo.
  #drawDot(ctx, column, row, size) {
    ctx.drawImage(
      this.yellowDot,
      column * this.tileSize,
      row * this.tileSize,
      size,
      size
    );
  }
//El método #drawPowerDot(ctx, column, row, size) se encarga de dibujar un punto de poder en el lienzo del juego. 
//Se decrementa el temporizador de animación del punto de poder en uno. Si el temporizador llega a cero, se reinicia al valor predeterminado (this.powerDotAnmationTimerDefault) y se alterna entre las imágenes del punto de poder (this.powerDot) entre rosa (this.pinkDot) y amarillo (this.yellowDot). Esto crea un efecto de parpadeo entre los dos colores.
  #drawPowerDot(ctx, column, row, size) {
    this.powerDotAnmationTimer--;
    if (this.powerDotAnmationTimer === 0) {
      this.powerDotAnmationTimer = this.powerDotAnmationTimerDefault;
      if (this.powerDot == this.pinkDot) {
        this.powerDot = this.yellowDot;
      } else {
        this.powerDot = this.pinkDot;
      }
    }
    ctx.drawImage(this.powerDot, column * size, row * size, size, size);
  }
//El método #drawWall(ctx, column, row, size) se encarga de dibujar una pared en el lienzo del juego.
  #drawWall(ctx, column, row, size) {
    ctx.drawImage(
      this.wall,
      column * this.tileSize,
      row * this.tileSize,
      size,
      size
    );
  }
//
  #drawBlank(ctx, column, row, size) {
    ctx.fillStyle = "black";
    ctx.fillRect(column * this.tileSize, row * this.tileSize, size, size);
  }
//se utiliza para obtener la posición inicial del personaje Pacman en el mapa y crear una nueva instancia de la clase Pacman con esa posición.
//velocity: Es el parámetro que indica la velocidad inicial del Pacman que se está creando.
//La función va por cada fila y columna del mapa para buscar donde está el Pacman (tile === 4). Cuando encuentra la posición, establece el valor de la casilla donde está Pacman en el mapa como 0, indicando que la casilla está vacía ahora. 
  getPacman(velocity) {
    for (let row = 0; row < this.map.length; row++) {
      for (let column = 0; column < this.map[row].length; column++) {
        let tile = this.map[row][column];
        if (tile === 4) {
          this.map[row][column] = 0;
          return new Pacman(
            column * this.tileSize,
            row * this.tileSize,
            this.tileSize,
            velocity,
            this
          );
        }
      }
    }
  }
// Se utiliza para obtener las posiciones iniciales de los enemigos en el mapa y crear nuevas instancias de la clase Enemy
//recorre cada fila y columna del mapa para buscar las posiciones de los enemigos (tile == 6). Cuando encuentra una posición, realiza lo siguiente: Establece el valor de la casilla donde se encuentra el enemigo en el mapa como 0, lo que indica que la casilla está vacía ahora.
  getEnemies(velocity) {
    const enemies = [];

    for (let row = 0; row < this.map.length; row++) {
      for (let column = 0; column < this.map[row].length; column++) {
        const tile = this.map[row][column];
        if (tile == 6) {
          this.map[row][column] = 0;
          enemies.push(
            new Enemy(
              column * this.tileSize,
              row * this.tileSize,
              this.tileSize,
              velocity,
              this
            )
          );
        }
      }
    }
    return enemies;
  }

  setCanvasSize(canvas) {
    canvas.width = this.map[0].length * this.tileSize;
    canvas.height = this.map.length * this.tileSize;
  }
// se utiliza para verificar si una colisión ha ocurrido entre un objeto móvil y el entorno del juego, como las paredes del mapa.
//if (direction == null) { return; }: Verifica si la dirección es nula. Si es nula, significa que no hay movimiento, por lo que la función sale temprano sin realizar ninguna comprobación de colisión.
  didCollideWithEnvironment(x, y, direction) {
    if (direction == null) {
      return;
    }
//Este bloque de código se encarga de verificar si un objeto móvil colisionará con una pared en el siguiente paso de su movimiento, dependiendo de la dirección en la que se esté moviendo
//Number.isInteger(x / this.tileSize): va a verificar si la coordenada x está perfectamente alineada con una columna de celdas en el mapa. Si el objeto está dentro de una celda en la dirección horizontal.
//Number.isInteger(y / this.tileSize): Verifica si la coordenada y está perfectamente alineada con una fila de celdas en el mapa. Si el objeto está dentro de una celda en la dirección vertical.
    if (
      Number.isInteger(x / this.tileSize) &&
      Number.isInteger(y / this.tileSize)
    ) {
      let column = 0;
      let row = 0;
      let nextColumn = 0;
      let nextRow = 0;
//Si las coordenadas del objeto están alineadas con una celda, se calculan las coordenadas de la celda actual (row, column) y las coordenadas de la siguiente celda en la dirección del movimiento
//Dependiendo de la dirección en la que se está moviendo el objeto (MovingDirection.right, MovingDirection.left, MovingDirection.up, MovingDirection.down), se calculan las coordenadas de la siguiente celda en esa dirección.
//Se accede al valor de la celda en la matriz del mapa utilizando las coordenadas de la siguiente celda calculadas anteriormente. Si el valor de la celda es 1, significa que hay una pared en esa posición y se devuelve true para indicar una colisión. Si no se encuentra una colisión con una pared, se devuelve false.
      switch (direction) {
        case MovingDirection.right:
          nextColumn = x + this.tileSize;
          column = nextColumn / this.tileSize;
          row = y / this.tileSize;
          break;
        case MovingDirection.left:
          nextColumn = x - this.tileSize;
          column = nextColumn / this.tileSize;
          row = y / this.tileSize;
          break;
        case MovingDirection.up:
          nextRow = y - this.tileSize;
          row = nextRow / this.tileSize;
          column = x / this.tileSize;
          break;
        case MovingDirection.down:
          nextRow = y + this.tileSize;
          row = nextRow / this.tileSize;
          column = x / this.tileSize;
          break;
      }
      const tile = this.map[row][column];
      if (tile === 1) {
        return true;
      }
    }
    return false;
  }
//Este bloque de código contiene métodos relacionados con la interacción del jugador con el juego y su progreso.
//Este método verifica si el jugador ha ganado el juego. Retorna true si no quedan puntos en el mapa, lo que significa que el jugador ha comido todos los puntos y ha ganado.
  didWin() {
    return this.#dotsLeft() === 0;
  }
//Este método privado cuenta cuántos puntos quedan en el mapa. Utiliza el método flat() para aplanar la matriz del mapa y luego filtra los elementos que son igual a 0, que representan los puntos comestibles restantes.
  #dotsLeft() {
    return this.map.flat().filter((tile) => tile === 0).length;
  }
// Este método se llama cuando el jugador come un punto normal, toma las coordenadas del jugador y verifica si está sobre un punto comestible. Si es así, marca ese punto como comido y  retorna true. Si no está sobre un punto comestible se torna false.
  eatDot(x, y) {
    const row = y / this.tileSize;
    const column = x / this.tileSize;
    if (Number.isInteger(row) && Number.isInteger(column)) {
      if (this.map[row][column] === 0) {
        this.map[row][column] = 5;
        return true;
      }
    }
    return false;
  }
//Verifica si el jugador está sobre un punto de poder. si pasa por un punto de poder marca ese punto como comido y retorna true. Si no está sobre un punto de poder, retorna false.
  eatPowerDot(x, y) {
    const row = y / this.tileSize;
    const column = x / this.tileSize;
    if (Number.isInteger(row) && Number.isInteger(column)) {
      const tile = this.map[row][column];
      if (tile === 7) {
        this.map[row][column] = 5;
        return true;
      }
    }
    return false;
  }
}
