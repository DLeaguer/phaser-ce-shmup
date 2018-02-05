//jshint esversion: 6

(Phaser => {
  // console.log(Phaser);
  const GAME_WIDTH = 460;
  const GAME_HEIGHT = 600;
  const GAME_CONTAINER_ID = 'game';
  const GFX = 'gfx';
  const INITIAL_MOVESPEED = 4;
  const SQRT_TWO = Math.sqrt(2);
  const PLAYER_BULLET_SPEED = 6;
  const ENEMY_SPAWN_FREQ = 100; // higher is less frequent
  const ENEMY_SPEED = 4.5;

  const randomGenerator = new Phaser.RandomDataGenerator();


  const game = new Phaser.Game(GAME_WIDTH, GAME_HEIGHT, Phaser.AUTO, GAME_CONTAINER_ID, { preload, create, update });



  let player;
  let cursors;
  let playerBullets;
  let enemies;

  // Core game methods
  function preload() {
  	game.load.spritesheet(GFX, '../assets/shmup-spritesheet-140x56-28x28-tile.png', 28, 28);

  }

  function create() {
  	cursors = game.input.keyboard.createCursorKeys();
  	cursors.fire = game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
  	cursors.fire.onUp.add( handlePlayerFire );
  	
  	player = game.add.sprite(100,100, GFX, 8);
  	player.moveSpeed = INITIAL_MOVESPEED;
  	playerBullets = game.add.group();
  	enemies = game.add.group();



  }


  function update() {
    handlePlayerMovement();
    handleBulletAnimations();
  	handleEnemyActions();
    handleCollisions();
    randomlySpawnEnemy();

    cleanup();


  }

  function handlePlayerMovement() {
    let movingH = Math.sqrt(2);
  	let movingV = Math.sqrt(2);
  	
  	if( cursors.up.isDown || cursors.down.isDown){
    movingH = 1; // slow down diagonal movement
  	}
  	if( cursors.left.isDown || cursors.right.isDown){
    movingV = 1; // slow down diagonal movement
    }
    
    switch( true ){
      case cursors.left.isDown:
        player.x -= player.moveSpeed * movingH;
        break;
      case cursors.right.isDown:
        player.x += player.moveSpeed * movingH;
        break;
    }
    switch( true ){
      case cursors.down.isDown:
        player.y += player.moveSpeed * movingV;
        break;
      case cursors.up.isDown:
        player.y -= player.moveSpeed * movingV;
        break;
    }
  }

  //handler function

function handlePlayerHit() {
    gameOver();
  }
  
  function handlePlayerFire() {
  	 playerBullets.add( game.add.sprite(player.x, player.y, GFX, 7) );
  	// console.log("fire");
  }

  function handleBulletAnimations() {
  playerBullets.children.forEach( bullet => bullet.y -= PLAYER_BULLET_SPEED );
}

  function randomlySpawnEnemy() {
    if(randomGenerator.between(0, ENEMY_SPAWN_FREQ) === 0) {
      let randomX = randomGenerator.between(0, GAME_WIDTH);
      enemies.add( game.add.sprite(randomX, -24, GFX, 0));
    }
  }

  function handleEnemyActions() {
    enemies.children.forEach( enemy => enemy.y += ENEMY_SPEED );
  }

function removeBullet(bullet) {
    bullet.destroy();
  }

  function destroyEnemy(enemy) {
    enemy.kill();
  }

  function handleCollisions() {
    // check if any bullets touch any enemies
    let enemiesHit = enemies.children
      .filter( enemy => enemy.alive )
      .filter( enemy => 
        playerBullets.children.some( 
          bullet => enemy.overlap(bullet) 
        )

      );


    if( enemiesHit.length ){
      // clean up bullets that land
      playerBullets.children
        .filter( bullet => bullet.overlap(enemies) )
        .forEach( removeBullet );

      enemiesHit.forEach( destroyEnemy );
    }
     // check if enemies hit the player
    enemiesHit = enemies.children
      .filter( enemy => enemy.overlap(player) );

    if( enemiesHit.length){
      handlePlayerHit();

      enemiesHit.forEach( destroyEnemy );
    }
  }

//Utility function

function cleanup() {
    playerBullets.children
      .filter( bullet => bullet.y < -14 )
      .forEach( bullet => bullet.destroy() );
  }


function gameOver() {
    game.state.destroy();
    game.add.text(90, 200, 'YOUR HEAD ASPLODE', { fill: '#FFFFFF' });
    let playAgain = game.add.text(120, 300, 'Play Again', { fill: '#FFFFFF' });
    playAgain.inputEnabled = true;
    playAgain.events.onInputUp.add(() => window.location.reload());
  }    

})(window.Phaser);



