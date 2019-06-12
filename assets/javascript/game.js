$(document).ready(function(){

    var charactersName = ["Batman","Superman","Iron-Man","Spiderman","Captain-America"];
    var characters = [];
    var divSelection = $(".selection");
    var divEnemies = $(".enemies");
    var characterChosen = {};
    var enemyChosen = {};
    var battleStarted = false;
    var enemyStartHealth;
    var userStartHealth;
    var userStartAttack;
    var enemiesRemained;
    

    function animateCSS(element, animationName, callback) {
        const node = document.querySelector(element);
        node.classList.add('animated', animationName);
    
        function handleAnimationEnd() {
            node.classList.remove('animated', animationName);
            node.removeEventListener('animationend', handleAnimationEnd);
    
            if (typeof callback === 'function') callback();
        }
    
        node.addEventListener('animationend', handleAnimationEnd);
    }

    //get random value between 2 values
    function getRandomValue(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
    }
    
    //create characters
    function createCharacters(){
        characters = [];
        for (var i=0; i< charactersName.length; i++){
            var character = {
                id: i,
                name: charactersName[i].replace("-"," "),
                healthPoints: getRandomValue(100,300),
                attackPower: getRandomValue(3,15),
                counterAttackPower: getRandomValue(10,50),
                picture: "assets/images/" + charactersName[i].toLocaleLowerCase() + ".png"

            };
            characters.push(character);
        }
        enemiesRemained = characters.length-1;
    }

    function addCharacterIntoDiv(div, character){
        var figure = $("<figure>");
        figure.attr("id","figure-"+character.id);

        var caption = $("<figcaption>");
        caption.attr("id","fig-caption-"+character.id)
        caption.html(character.name + "<br>HP: " + character.healthPoints);

        var img = $("<img>");
        img.attr("src",character.picture);
        img.attr("alt",character.name);
        img.attr("id",character.id);

        figure.append(img);
        figure.append(caption);
        div.append(figure);

    }


    function addChosenData(){

        var chosenCaption = $("#fig-caption-"+characterChosen.id);
        
        chosenCaption.html(characterChosen.name+"<br>");
        var spanHP = $("<span>");
        var spanAP = $("<span>");
        spanHP.attr("id","data-chosen-hp");
        spanHP.text(characterChosen.healthPoints);
        spanAP.attr("id","data-chosen-ap");
        spanAP.text(characterChosen.attackPower);

        chosenCaption.append("HP: ");
        chosenCaption.append(spanHP);
        chosenCaption.append(" Attack: ");
        chosenCaption.append(spanAP);

    }

    function updateBattle(){
        //calculates the percentage of HP
        
        var pcUserHp = (characterChosen.healthPoints / userStartHealth)*100;
        var pcEnemyHp = (enemyChosen.healthPoints / enemyStartHealth)*100;
        
        $("#enemy-hp").animate({ width: pcEnemyHp.toString()+"%" });
        $("#enemy-hp").text(enemyChosen.healthPoints);
        
        $("#user-hp").animate({ width: pcUserHp.toString()+"%" });
        $("#user-hp").text(characterChosen.healthPoints);
        
        $("#data-chosen-hp").text(characterChosen.healthPoints);
        $("#data-chosen-ap").text(characterChosen.attackPower);

    }

    //sets the characters and their atributes on the battle field and prepare to start the battle
    function startBattle(){
        animateCSS('#enemy-character', 'slideInDown');
        animateCSS('#user-character', 'slideInDown');
        battleStarted = true;
        $("#user-character").attr("src",characterChosen.picture);
        $("#user-character").css("visibility","visible");
        $("#battle-user").text(characterChosen.name);

        $("#enemy-character").attr("src",enemyChosen.picture);
        $("#enemy-character").css("visibility","visible");
        
        $("#battle-enemy").text(enemyChosen.name);
        
        $("#btn-attack").css("display","block");
        $("#btn-attack").removeAttr("disabled");
        
        $("#battle-msg").text("Fight!");
        $("#battle-msg").css("display","block");
        enemyStartHealth = enemyChosen.healthPoints;


        //update data of the battle
        updateBattle();

    }

    function gameOver(){
        animateCSS('#enemy-character', 'flip', function(){
            animateCSS('#user-character','fadeOut');
            $("#user-character").css("visibility","hidden");
            $("#user-hp").css("width", "0");
            $("#user-hp").text("0");
            $("#battle-msg").html("GAME OVER<br>Sorry... You Lost! Try again!");
            $("#btn-restart").css("display","block");
            $("#btn-attack").css("display","none");
        });
        
        
    }

    function destroyEnemy(){
        var msg;
        animateCSS('#user-character', 'flip', function(){
            animateCSS('#enemy-character','fadeOut');
            $("#enemy-character").css("visibility","hidden");
            $("#enemy-hp").css("width", "0");
            $("#enemy-hp").text("0");
            $("#btn-attack").attr("disabled", "true");
    
            //decrease the enemies remained
            enemiesRemained--;
    
            if(enemiesRemained == 0){
                msg = "<br>You won the Game!!!";
                $("#btn-restart").css("display","block");
                $("#btn-attack").css("display", "none");
            }
            else{
                msg = "You defeated "+enemyChosen.name+" on this battle!<br> Choose another enemy to fight!";
            }
            $("#battle-msg").html("CONGRATULATIONS! "+msg);
    
            battleStarted = false;
        });

    }
    
    function reset(){
        characterChosen = {};
        enemyChosen = {};
        battleStarted = false;
        divEnemies.empty();
        divSelection.empty();
        $("#btn-restart").css("display","none");
        $("#btn-attack").css("display","none");
        $("#btn-attack").removeAttr("disabled");
        $("#battle-msg").css("display","none");
        $("#battle-msg").text("Fight!");
        $("#text-choose-character").text("Choose your character");
        $(".enemies-wrap").css("display","none");
        $("#enemy-character").css("visibility","hidden");
        $("#user-character").css("visibility","hidden");
        $("#battle-user").text("Player");
        $("#battle-enemy").text("Enemy");
        $("#enemy-hp").animate({ width: "0" });
        $("#user-hp").animate({ width: "0" });

    }

    function start(){
        createCharacters();
        showOptions();
    }


    //place all characteres on the Selection div
    function showOptions (){
        for(var i=0; i < characters.length; i++){
            addCharacterIntoDiv(divSelection,characters[i]);
        }
    }

    //when the user chooses the character
    $(".selection").click(function(event){

        //makes sure that user choose once and that an img tag was clicked
        if(Object.keys(characterChosen).length === 0 && event.target.nodeName == "IMG")
        {
            var choice = event.target.id;

            characterChosen = characters[choice]; //assign the character chosen into the global variable
            divSelection.empty(); //cleans the selection div
            addCharacterIntoDiv(divSelection, characters[choice]); //add character chosen into the selection div
            addChosenData(); //add info about the chosen beside of chosen character
            
            $("#"+choice).attr("class","chosen"); //applies the css class on the chosen
    
            //add all the enemies characters into enemy div
            for(var i=0; i < characters.length; i++){
                if(i != choice){
                    addCharacterIntoDiv(divEnemies, characters[i]);
                }
            }

            userStartHealth = characterChosen.healthPoints; 
            userStartAttack = characterChosen.attackPower;
            $("#text-choose-character").text("You!");
            $(".enemies-wrap").css("display","block");
    
        }
        
    });

    //when the user chooses the enemy
    $(".enemies").click(function(event){

        //makes sure that an img tag was clicked
        if(event.target.nodeName == "IMG" && !battleStarted)
        {
            var choice = event.target.id;

            enemyChosen = characters[choice]; //assign the character chosen into the global variable

            //hides the chosen one from the enemies div
            $("#figure-"+choice).css("display","none");


            startBattle();
    
        }
        
    });

    //when the user attacks the enemy
    $("#btn-attack").click(function(){
        $(this).attr("disabled","true");
        //animation: user attacks the enemy (animation)
        animateCSS('#user-character', 'flip', function(){
            //the enemy loses health
            enemyChosen.healthPoints -= characterChosen.attackPower;
            
            $("#battle-msg").text("You attacked "+enemyChosen.name+" for "+characterChosen.attackPower+" damage.");
            //the user increases its power
            characterChosen.attackPower += userStartAttack;

            //update screen data
            updateBattle(); 

            //if the enemy loses all hp
            if(enemyChosen.healthPoints <= 0){ 
                destroyEnemy();
            }
            else{
                //animation: enemy shakes 
                animateCSS('#enemy-character', 'shake', function(){
                    //animation: enemy counter-attack
                    animateCSS('#enemy-character', 'flip', function(){
                        animateCSS('#user-character', 'shake'); 

                        //the user loses health with the counter attack of the enemy
                        characterChosen.healthPoints -= enemyChosen.counterAttackPower;

                        $("#battle-msg").html($("#battle-msg").text()+"<br>"+enemyChosen.name+" attacked you back for "+enemyChosen.counterAttackPower+" damage.");

                        updateBattle();

                        //if the user loses all hp
                        if(characterChosen.healthPoints <=0){ 
                            gameOver();
                        }

                        $("#btn-attack").removeAttr("disabled");

                    });
                    

                });

            }            
    
        });
    
       
        
        

    });
    
    $("#btn-restart").click(function(){
        reset();
        start();
    });



    //starts the game
    start();
   


});