/*var cat = {
	firstName : "Tible",
	lastName : " Britannia",
	color : "#00FFFF",
	favoriteFood : "The World",
	catName : function(){
		return(this.firstName + "Vi" + this.lastName);

	}
	favoriteToy : fToy = {
		name : "bale",
		color : "red"
	}



}
alert(cat.firstName);
alert(cat.color);
alert(cat.favoriteToy.color);

document.getElementById("title").innerHTML + cat.catName();
*/

//this3strap for argon
var options = THREE.Bootstrap.createArgonOptions( Argon.immersiveContext );
  options.renderer = { klass: THREE.WebGLRenderer };
  	var three = THREE.Bootstrap( options );

//adds light to scene
var light = new THREE.DirectionalLight( 0xffffff, 1); light.position.set( 0, -4, -4 ).normalize();
	three.scene.add( light );
		var pointLight = new THREE.PointLight( 0xffffff, 1.5, 1000 ); three.camera.add(pointLight);

//links the site/ server of vuforia
Argon.immersiveContext.setRequiredCapabilities('Vuforia');

//license key for vuforia allows us to not have to use defalt image that they have
Argon.Vuforia.initialize({ 
    licenseKey: null, 
    startCamera: true, 
  }) .then(function(api) { 
    // load, activate, and use our dataSet 
    api.loadDataSetFromURL('xml/StonesAndChips.xml').then(function (dataSet) { 
    	  dataSet.activate() 
     		 setupStonesContent(dataSet.trackables.stones) 
     	 setupChipsContent(dataSet.trackables.chips) 
    }).then(api.startObjectTracker) 
     	 .then(api.hintMaxSimultaneousImageTargets.bind(api, 2)) 
  })

//setting up trackables
  function setupStonesContent( stonesEntity ) { 
    // create an Object3D from the stones entity 
    var stones = three.argon.objectFromEntity(stonesEntity) 
    // create a box 
    var box = new THREE.Mesh(new THREE.BoxGeometry(50, 50, 50), new THREE.MeshNormalMaterial()) 
    box.position.y = 25 
    var boxSpin = 0 
    // add and spin the box when the stones trackable is found 
    stones.addEventListener('argon:found', function() { 
      stones.add(box) 
      boxSpin = 10 
    }) 
    // remove the box when the stones trackable is lost 
    stones.addEventListener('argon:lost', function() { 
      stones.remove(box) 
    }) 
    // animate the box 
    three.on('update', function() { 
      box.rotation.y += boxSpin * three.Time.delta 
      if (boxSpin > 0) boxSpin -= 10 * three.Time.delta 
      else boxSpin = 0 
    }) 
  }

//chips content tranks 3d moodel
  function setupChipsContent( chipsEntity ) { 
    // create an Object3D from the chips entity 
    var chips = three.argon.objectFromEntity(chipsEntity) 
    // add the model when the chips trackable is found 
    chips.addEventListener('argon:found', function() { 
      getModel().then(function(model) { 
        chips.add(model) 
      }) 
    }) 
    // remove the model when the chips trackable is lost 
    chips.addEventListener('argon:lost', function() { 
      getModel().then(function(model) { 
        chips.remove(model) 
      }) 
    }) 
  }

//verify model really exists?
  var modelPromise = getModel() 
  function getModel() { 
    return modelPromise = modelPromise || new Promise(function(resolve, reject) { 
      // load the model 
      var loader = new THREE.JSONLoader() 
      loader.load( 'json/monster.json', function ( geometry, materials ) { 
      loader.load( 'json/space figtor animant.json', function ( geometry, materials ) { 
        materials[0].morphTargets = true 
        var faceMaterial = new THREE.MeshFaceMaterial( materials ) 
        var morphMesh = new THREE.MorphAnimMesh( geometry, faceMaterial ) 
        morphMesh.duration = 1000 
        morphMesh.time = 0 
        morphMesh.scale.set(0.1,0.1,0.1) 
        morphMesh.position.set(-100,0,0) 
        morphMesh.matrixAutoUpdate = false 
        morphMesh.updateMatrix() 
        // animate the model 
        three.on('update', function() { 
          morphMesh.updateAnimation( 1000 * three.Time.delta ) 
        }) 
        resolve(morphMesh) 
      }) 
    }) 
  }