//Basic Particle Animation
//Author: Brandon John-Freso
$(function () {
    var W, H,
        canvas, ctx, //ctx stands for context and is the "curso" of our canvas element.
        particleCount = 400,
        particles = [], //this is an array which will hold our particles Object/Class
        colorArray = ["#00a64c","#fcf509", "#005b76", "#ffa809", "#840107"]; //green, yellow, blue, orange, red

    W = window.innerWidth * .99;
    H = window.innerHeight * .99;
    canvas = $("#particel-anim").get(0); //this "get(0) will pull the underlying non-jquery wrapped dom element from our selection
    canvas.width = W;
    canvas.height = H;
    ctx = canvas.getContext("2d"); // settng the context to 2d rather than the 3d WEBGL
    console.log(ctx);

    //Setup particle class
    function Particle() {
        this.color = colorArray[Math.floor((Math.random()*5)+1)];
        this.x = Math.random() * W;
        this.y = Math.random() * H;
        this.direction = {
            "x": -1 + Math.random() * 2,
            "y": -1 + Math.random() * 2
        };
        this.vx = 1 * Math.random() + 1;
        this.vy = 1 * Math.random() + 1;
        //this.radius = .9 * Math.random() + 1;
        this.radius = .1 * Math.random() + 2.6;
        this.move = function () {
            this.x += this.vx * this.direction.x;
            this.y += this.vy * this.direction.y;
        };
        this.changeDirection = function (axis) {
            this.direction[axis] *= -1;
        };
        this.draw = function () {
            ctx.beginPath();
            ctx.fillStyle = this.color;
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
            ctx.fill();
        };
        this.boundaryCheck = function () {
            if (this.x >= W) {
                this.x = W;
                this.changeDirection("x");
            } else if (this.x <= 0) {
                this.x = 0;
                this.changeDirection("x");
            }
            if (this.y >= H) {
                this.y = H;
                this.changeDirection("y");
            } else if (this.y <= 0) {
                this.y = 0;
                this.changeDirection("y");
            }
        };
    } //end particle class

    function clearCanvas() {
        ctx.clearRect(0, 0, W, H);
    } //end clear canvas

    function createParticles() {
        for (var i = particleCount - 1; i >= 0; i--) {
            p = new Particle();
            particles.push(p);
        }
    } // end createParticles

    function drawParticles() {
        for (var i = particleCount - 1; i >= 0; i--) {
            p = particles[i];
            p.draw();
        }
    } //end drawParticles

    function updateParticles() {
        for (var i = particles.length - 1; i >= 0; i--) {
            p = particles[i];
            p.move();
            p.boundaryCheck();

        }
    } //end updateParticles

    function initParticleSystem() {
        createParticles();
        drawParticles();
    }

    function animateParticles() {
        clearCanvas();
        drawParticles();
        updateParticles();
        requestAnimationFrame(animateParticles);
    }
  
    initParticleSystem();
    requestAnimationFrame(animateParticles);





});