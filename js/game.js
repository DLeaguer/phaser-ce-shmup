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

  };

  function create() {
  	cursors = game.input.keyboard.createCursorKeys();
  	cursors.fire = game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
  	cursors.fire.onUp.add( handlePlayerFire );
  	
  	player = game.add.sprite(100,100, GFX, 8);
  	player.moveSpeed = INITIAL_MOVESPEED;
  	playerBullets = game.add.group();
  	enemies = game.add.group();



  };


  function update() {
    handlePlayerMovement();
    handleBulletAnimations();
    randomlySpawnEnemy()
	handleEnemyActions()

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
        player.x -= player.moveSpeed;
        break;
      case cursors.right.isDown:
        player.x += player.moveSpeed;
        break;
    }
    switch( true ){
      case cursors.down.isDown:
        player.y += player.moveSpeed;
        break;
      case cursors.up.isDown:
        player.y -= player.moveSpeed;
        break;
    }
  };

  //handler function

  function handlePlayerFire() {
  	 playerBullets.add( game.add.sprite(player.x, player.y, GFX, 7) );
  	// console.log("fire");
  };

  function handleBulletAnimations() {
  playerBullets.children.forEach( bullet => bullet.y -= PLAYER_BULLET_SPEED );
};

  function randomlySpawnEnemy() {
    if(randomGenerator.between(0, ENEMY_SPAWN_FREQ) === 0) {
      let randomX = randomGenerator.between(0, GAME_WIDTH);
      enemies.add( game.add.sprite(randomX, -24, GFX, 0));
    }
  };

  function handleEnemyActions() {
    enemies.children.forEach( enemy => enemy.y += ENEMY_SPEED );
  };


//Utility function

function cleanup() {
    playerBullets.children
      .filter( bullet => bullet.y < -14 )
      .forEach( bullet => bullet.destroy() );
  };

  

})(window.Phaser);



