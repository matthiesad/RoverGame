class Rover {
  constructor (x, y, width, height) {
    this.x = parseInt(localStorage.getItem('x')) || x
    this.y = parseInt(localStorage.getItem('y')) || y
    this.direction = localStorage.getItem('direction') || 'south'
    this.width = width
    this.height = height

    this.img = new Image()
    this.img.src = 'https://i.stack.imgur.com/rsH6n.png'

    this.controlRover()
  }

  controlRover () {
    document.addEventListener('keydown', e => {
      const key = e.keyCode
      switch (key) {
        case 39:
          this.turnRight()
          break
        case 37:
          this.turnLeft()
          break
        case 38:
          this.drive()
          break
        case 40:
          this.drive(false)
          break
        default:
          break;
      }
    })
  }

  drive (forward = true) {
    switch (this.direction) {
      case 'north':
        forward ? this.moveDown() : this.moveTop()
        break;
      case 'east':
        forward ? this.moveLeft() : this.moveRight() 
        break;
      case 'south':
        forward ? this.moveTop() : this.moveDown()
        break;
      case 'west':
        forward ? this.moveRight() : this.moveLeft()
        break;

      default:
        break;
		}
    this.saveLocation()
		game.alienCollision()
		game.diamondCollision()
  }

  turnRight () {
    switch (this.direction) {
      case 'north':
        this.direction = 'east'
        break;
      case 'east':
        this.direction = 'south'
        break;
      case 'south':
        this.direction = 'west'
        break;
      case 'west':
        this.direction = 'north'
        break;

      default:
        break;
    }
    this.saveLocation()
  }

  turnLeft () {
    switch (this.direction) {
      case 'north':
        this.direction = 'west'
        break;
      case 'west':
        this.direction = 'south'
        break;
      case 'south':
        this.direction = 'east'
        break;
      case 'east':
        this.direction = 'north'
        break;

      default:
        break;
    }
    this.saveLocation()
  }

  moveLeft () {
    if (this.x <= 0) return
    this.x -= 50
  }

  moveRight () {
    if (this.x >= 450) return
    this.x += 50
  }

  moveTop () {
    if (this.y <= 0) return
    this.y -= 50
  }

  moveDown () {
    if (this.y >= 450) return
    this.y += 50
  }

  saveLocation () {
    localStorage.setItem('x', this.x)
    localStorage.setItem('y', this.y)
    localStorage.setItem('direction', this.direction)
  }

  draw (ctx) {
    const angle = this.direction === 'north'
      ? Math.PI
      : this.direction === 'east'
        ? 1.5 * Math.PI
        : this.direction === 'south'
          ? 0
          : 0.5 * Math.PI

    ctx.save()
    ctx.translate(this.x + this.width/2, this.y + this.height/2)
    ctx.rotate(angle)
    ctx.drawImage(this.img, -this.width/2, -this.height/2, this.width, this.height)
    ctx.restore()
  }
}

class Game {
  constructor () {
    this.width = 500
    this.height = 500
		this.ctx = document.querySelector('#game').getContext('2d')
    this.diamonds = []
    this.score = 1
    this.level = 1
    this.alienCount = 0
    this.waitingForEnter = true
    this.newGame = true
    this.lost = false

    this.img = new Image()
    
		this.diamond = new Image()
		this.diamond.src='https://cdn-images-1.medium.com/max/2000/1*nLYGAk0_YP5JejzTi5_G7A.png'
    
    this.waitPic = new Image()
   		
    this.rover = new Rover(0, 0, 50, 50)
    this.alien = new Alien()


    this.start()
    
  }

  start () {
    localStorage.setItem('x',0)
			localStorage.setItem('y',0)
		this.update()	
  }

  drawPlayingField (level) {
		this.drawBackground(level)
    // for (let i = 1; i < 10; i++) {
    //   this.ctx.moveTo(0, i * 50)
    //   this.ctx.lineTo(this.width, i * 50)
    //   this.ctx.stroke()
    //   this.ctx.moveTo(i * 50, 0)
    //   this.ctx.lineTo(i * 50, this.height)
    //   this.ctx.stroke()
		// }	
		
  }

	reset () {
       this.ctx.clearRect(0, 0, this.width, this.height)
    
	}

	update () {
		requestAnimationFrame(() => {
      if(this.waitingForEnter === true){
        if(this.level === 8){
          this.waitPic.src = 'http://memeshappen.com/media/created/You-dont-win--chuck-norris-allows-you-to-win--meme-25900.jpg'
          this.ctx.drawImage(this.waitPic, 0,0, this.width, this.height)
        }else if(this.newGame === true){
          this.waitPic.src = 'http://politicalpunchline.com/wp-content/uploads/2018/06/trump-insanity-and-beyond.png'
          this.ctx.drawImage(this.waitPic, 0,0, this.width, this.height)
        }else if(this.lost === true){
          this.waitPic.src = 'https://ak1.picdn.net/shutterstock/videos/22752961/thumb/7.jpg'
          this.ctx.drawImage(this.waitPic, 0,0, this.width, this.height)
        }
        this.enterHit()
      }else{
      this.reset()
			this.drawPlayingField(this.level)
			this.rover.draw(this.ctx)
			this.drawDiamond()
      this.alien.drawAlien(this.alienCount, this.diamonds, this.level)
    }
      this.update()
    
    })
  }


	drawBackground (level){
    switch(level){
      case 1:
        this.img.src ='https://static.planetminecraft.com/files/resource_media/screenshot/1148/sci-fi-post-apocalyptic-28081_942730.jpg'
        this.ctx.drawImage(this.img, 0,0, this.width, this.height)
        break
      case 2:
        this.img.src = 'https://3c1703fe8d.site.internapcdn.net/newman/gfx/news/hires/2018/universe.jpg'
        this.ctx.drawImage(this.img, 0,0, this.width, this.height)
        break
      case 3:
        this.img.src = 'https://www.galileo.tv/app/uploads/2017/06/170620-mars-rover-alien-circle-feature.jpg'
        this.ctx.drawImage(this.img, 0,0, this.width, this.height)
        break
      case 4:
        this.img.src = 'https://wi-images.condecdn.net/image/JpXDNr11zz3/crop/1020/f/iStock-497707356.jpg'
        this.ctx.drawImage(this.img, 0,0, this.width, this.height)
        break
      case 5:
        this.img.src = 'https://colddarkstars.files.wordpress.com/2018/01/jupter.jpg'
        this.ctx.drawImage(this.img, 0,0, this.width, this.height)
        break
      case 6:
        this.img.src = 'https://news.nationalgeographic.com/content/dam/news/2017/04/11/black-hole/black-hole-event-horizon-01.ngsversion.1491940808945.adapt.1900.1.jpg'
        this.ctx.drawImage(this.img, 0,0, this.width, this.height)
        break
      case 7:
        this.img.src = 'https://cdn.images.express.co.uk/img/dynamic/151/590x/black-hole-alien-951680.jpg'
        this.ctx.drawImage(this.img, 0,0, this.width, this.height)
        break
      default:
        break
    }
			
	}

	alienCollision(){
		let collision = this.alien.aliens.find(alien =>{
			return (this.rover.x === alien.randomX && this.rover.y === alien.randomY)
		})
		if (collision){
			console.log(`Collision happens ${collision}`,collision)
      alert('Ohhhhhh, eaten by Alien....You lost al your Diamonds :(')
      this.score = 0
      this.alienCount = 0
      this.level = 1
			localStorage.setItem('x',0)
			localStorage.setItem('y',0)
			this.clearRover()
			this.alien.clearAliens()
      this.clearDiamond()
      this.waitingForEnter = true
      this.lost = true
      this.reset()
		}else{
			console.log(`No Collision happens ${collision}`,collision)
		}
	
	}

	clearRover(){
		this.rover.x =0
		this.rover.y =0
	}
	
	drawDiamond(){
		if (this.diamonds.length <= 0) {
				let randomX = 50 * Math.floor(Math.random()* 9)
        let randomY = 50 * Math.floor(Math.random()* 9)
				let diamondLocation = {randomX, randomY}
				this.diamonds.push(diamondLocation)
		}else {
				this.diamonds.map(elm => {
					this.ctx.drawImage(this.diamond, elm.randomX, elm.randomY, 50,50 )
				})
		}
	}

	clearDiamond(){
		this.diamonds = []
	}

	diamondCollision(){
		let collision = this.diamonds.find(diamond =>{
			return (this.rover.x === diamond.randomX && this.rover.y === diamond.randomY)
		})
		if (collision){
      console.log(`Collision happens ${collision}`,collision)
      this.score++
      this.alienCount += Math.round(Math.random()* this.level)

      alert(`YES!!! You got the Diamond. Your current score is ${this.score}`)
      if(this.score > 9 && this.score === (Math.round(this.score / 10)) * 10){
        this.level++
        alert(`WOW LEVEL UP!!!  Your new Level is ${this.level}`)
        if(this.level === 8){
          this.waitingForEnter = true
        }
        this.alienCount = 0
      }
			localStorage.setItem('x',0)
			localStorage.setItem('y',0)
			this.clearRover()
			this.alien.clearAliens()
			this.clearDiamond()
			this.update()	
		}else{
			console.log(`No Collision happens ${collision}`,collision)
		}
	}

  
  enterHit () {
    document.addEventListener('keydown', e => {
      const key = e.keyCode
      switch (key) {
        case 13:
          if(this.waitingForEnter === true){
            if(this.level === 8 || this.lost === true){
              this.waitingForEnter = true
              this.level = 1
              this.score = 0
              this.newGame = true
              this.lost = false
            }else if(this.waitingForEnter === true && this.newGame === true){
              this.newGame = false
              this.waitingForEnter = false
            }
        }
          // this.update()
          break
        default:
          // this.update()
          break;
      }
    })
  }

}


class Alien {
  constructor () {
    this.aliens = []
    this.alien = new Image()
		this.alien.src = 'https://openclipart.org/image/2400px/svg_to_png/218422/silly-alien-in-the-style-of-lemmling.png'

  }

  drawAlien (alienCount, diamonds) {

		if (this.aliens.length !== alienCount) {
			for(let i = 0; i < alienCount; i++){
				let randomX = 50*Math.floor(Math.random()* 9)
        let  randomY = 50* Math.floor(Math.random()* 9)
        let noBlockedField = diamonds.find(diamond =>{
          return (randomX === diamond.randomX && randomY === diamond.randomY)
        })
        console.log(noBlockedField)
        if(noBlockedField){
          console.log(`Collision happens ${noBlockedField}`,noBlockedField)
          i--
        }else{
          if(randomX !==0 && randomY !== 0){
              let alienLocation = {randomX, randomY}
              this.aliens.push(alienLocation)
           }else{
             i--
           }
        }
			}
		}else {
				this.aliens.map(elm => {
					game.ctx.drawImage(this.alien, elm.randomX, elm.randomY, 50,50 )
				})
		}
  }
  
  clearAliens(){
		this.aliens =[]
	}

}
    
class Player{
  constructor (name, score){
    this.name = name
  }
}
