

var Dijkstras = (function () {

    var Dijkstras = function () {
        this.graph = [];
        this.queue;
        this.distance = [];
        this.previous = []
    }
 
    /**
    * Creates a graph from array.
    * Each element in the array should be in the format:
    * 	[NODE NAME, [[NODE NAME, COST], ...] ]
    *
    * For example: 	[
    *		['A', [['B', 20], ['C', 20]] ],
    *		['B', [['A', 30], ['C', 100]] ],
    *		['C', [['D', 10], ['A', 20]] ],
    *		['D', [['C', 10], ['B', 20]] ]
    *	]
    *
    * @param graphy Array of nodes and vertices.
    **/
    Dijkstras.prototype.setGraph = function (graph)
    {
        // Error check graph
        if (typeof graph !== 'object') {
            throw "graph isn't an object (" + typeof graph + ")";
        }
 
        if (graph.length < 1) {
            throw "graph is empty";
        }
 
        for (var index in graph) {
            // Error check each node
            var node = graph[index];
            if (typeof node !== 'object' || node.length !== 2) {
                throw "node must be an array and contain 2 values (name, vertices). Failed at index: " + index;
            }
 
            var nodeName = node[0];
            var vertices = node[1];
            this.graph[nodeName] = [];
 
            for (var v in vertices) {
                // Error check each node
                var vertex = vertices[v];
                if (typeof vertex !== 'object' || vertex.length !== 2) {
                    throw "vertex must be an array and contain 2 values (name, vertices). Failed at index: " + index + "[" + v + "]" ;
                }
                var vertexName = vertex[0];
                var vertexCost = vertex[1];
                this.graph[nodeName][vertexName] = vertexCost;
            }
        }
    }
 
    /**
    * Find shortest path
    *
    * @param source The starting node.
    * @param target The target node.
    * @return array Path to target, or empty array if unable to find path.
    */
    Dijkstras.prototype.getPath = function (source, target)
    {
        // Check source and target exist
        if (typeof this.graph[source] === 'undefined') {
            throw "source " + source + " doesn't exist";
        }
        if (typeof this.graph[target] === 'undefined') {
            throw "target " + target + " doesn't exist";
        }
 
        // Already at target
        if (source === target) {
            return [];
        }
 
        // Reset all previous values
        this.queue = new MinHeap();
        this.queue.add(source, 0);
        this.previous[source] = null;
 
        // Loop all nodes
        var u = null
        while (u = this.queue.shift()) {
            // Reached taget!
            if (u === target) {
                var path = [];
                while (this.previous[u] != null) {
                    path.unshift(u);
                    u = this.previous[u];
                }
                return path;
            }
 
            // all remaining vertices are inaccessible from source
            if (this.queue.getDistance(u) == Infinity) {
                return [];
            }
 
            var uDistance = this.queue.getDistance(u)
            for (var neighbour in this.graph[u]) {
                var nDistance = this.queue.getDistance(neighbour),
                    aDistance = uDistance + this.graph[u][neighbour];
 
                if (aDistance < nDistance) {
                    this.queue.update(neighbour, aDistance);
                    this.previous[neighbour] = u;
                }
            }
        }
 
        return [];
    }
 
 
 
    // Fibonacci Heap (min first)
    var MinHeap = (function() {
        var MinHeap = function () {
            this.min = null;
            this.roots = [];
            this.nodes = [];
        }
 
        MinHeap.prototype.shift = function()
        {
            var minNode = this.min;
 
            // Current min is null or no more after it
            if (minNode == null || this.roots.length < 1) {
                this.min = null;
                return minNode
            }
 
            // Remove it
            this.remove(minNode);
 
            // Consolidate
            if (this.roots.length > 50) {
                this.consolidate();
            }
 
            // Get next min
            var lowestDistance = Infinity,
                length = this.roots.length;
 
            for (var i = 0; i < length; i++) {
                var node = this.roots[i],
                    distance = this.getDistance(node);
 
                if (distance < lowestDistance) {
                    lowestDistance = distance;
                    this.min = node;
                }
            }
 
            return minNode;
        }
 
        MinHeap.prototype.consolidate = function()
        {
            // Consolidate
            var depths = [ [], [], [], [], [], [], [] ],
                maxDepth = depths.length - 1, // 0-index
                removeFromRoots = [];
 
            // Populate depths array
            var length = this.roots.length;
            for (var i = 0; i < length; i++) {
                var node = this.roots[i],
                depth = this.nodes[node].depth;
 
                if (depth < maxDepth) {
                    depths[depth].push(node);
                }
            }
 
            // Consolidate
            for (var depth = 0; depth <= maxDepth; depth++) {
                while (depths[depth].length > 1) {
 
                    var first = depths[depth].shift(),
                        second = depths[depth].shift(),
                        newDepth = depth + 1,
                        pos = -1;
 
                    if (this.nodes[first].distance < this.nodes[second].distance) {
                        this.nodes[first].depth = newDepth;
                        this.nodes[first].children.push(second);
                        this.nodes[second].parent = first;
 
                        if (newDepth <= maxDepth) {
                            depths[newDepth].push(first);
                        }
 
                        // Find position in roots where adopted node is
                        pos = this.roots.indexOf(second);
 
                    } else {
                        this.nodes[second].depth = newDepth;
                        this.nodes[second].children.push(first);
                        this.nodes[first].parent = second;
 
                        if (newDepth <= maxDepth) {
                            depths[newDepth].push(second);
                        }
 
                        // Find position in roots where adopted node is
                        pos = this.roots.indexOf(first);
                    }
 
                    // Remove roots that have been made children
                    if (pos > -1) {
                        this.roots.splice(pos, 1);
                    }
                }
            }
        }
 
        MinHeap.prototype.add = function(node, distance)
        {
            // Add the node
            this.nodes[node] = {
                node: node,
                distance: distance,
                depth: 0,
                parent: null,
                children: []
            };
 
            // Is it the minimum?
            if (!this.min || distance < this.nodes[this.min].distance) {
                this.min = node;
            }
 
            // Other stuff
            this.roots.push(node);
        }
 
        MinHeap.prototype.update = function(node, distance)
        {
            this.remove(node);
            this.add(node, distance);
        }
 
        MinHeap.prototype.remove = function(node)
        {
            if (!this.nodes[node]) {
                return;
            }
 
            // Move children to be children of the parent
            var numChildren = this.nodes[node].children.length;
            if (numChildren > 0) {
                for (var i = 0; i < numChildren; i++) {
                    var child = this.nodes[node].children[i];
                    this.nodes[child].parent = this.nodes[node].parent;
 
                    // No parent, then add to roots
                    if (this.nodes[child].parent == null) {
                        this.roots.push(child);
                    }
                }
            }
 
            var parent = this.nodes[node].parent;
 
            // Root, so remove from roots
            if (parent == null) {
                var pos = this.roots.indexOf(node);
                if (pos > -1) {
                    this.roots.splice(pos, 1);
                }
            } else {
                // Go up the parents and decrease their depth
                while (parent) {
                    this.nodes[parent].depth--;
                    parent = this.nodes[parent].parent
                }
            }
        }
 
        MinHeap.prototype.getDistance = function(node)
        {
            if (this.nodes[node]) {
                return this.nodes[node].distance;
            }
            return Infinity;
        }
 
        return MinHeap;
    })();
 
    return Dijkstras;
 })();


let juliet = document.getElementById('juliet'); 
let romeo = document.getElementById('romeo'); 
let friar = document.getElementById('friar'); 
let capulet = document.getElementById('capulet'); 
let ladyCapulet = document.getElementById('lady-capulet'); 
let montague = document.getElementById('montague'); 
let ladyMontague = document.getElementById('lady-montague'); 
let benvolio = document.getElementById('benvolio'); 
let nurse = document.getElementById('nurse'); 


let connectLabel = document.getElementById('connect'); 
let submitConnections = document.getElementById('submit-connections'); 

let con1 = document.getElementById('con1'); 
let con1Label = document.getElementById('con1-label'); 
let con2 = document.getElementById('con2'); 
let con2Label = document.getElementById('con2-label'); 
let con3 = document.getElementById('con3'); 
let con3Label = document.getElementById('con3-label'); 
let con4 = document.getElementById('con4');
let con4Label = document.getElementById('con4-label'); 
let con5 = document.getElementById('con5'); 
let con5Label = document.getElementById('con5-label'); 
let con6 = document.getElementById('con6'); 
let con6Label = document.getElementById('con6-label'); 
let con7 = document.getElementById('con7'); 
let con7Label = document.getElementById('con7-label'); 
let con8 = document.getElementById('con8'); 
let con8Label = document.getElementById('con8-label'); 
let con9 = document.getElementById('con9'); 
let con9Label = document.getElementById('con9-label');

let graphCoordinates = [[100, 100], [300, 80], [500, 120], [660, 200], [720,340], [660, 480], [500, 480], [290, 530], [90, 320]]; 

let c = document.getElementById('myCanvas'); 
let ctx = c.getContext('2d'); 

// ctx.beginPath(); 
// ctx.arc(100,100,30,0,2*Math.PI); 
// ctx.closePath(); 
// ctx.stroke(); 

ctx.font = "17px Times New Roman"
// ctx.fillText('Romeo', graphCoordinates[1][0]-25, graphCoordinates[1][1]); 



// ctx.beginPath(); 
// ctx.arc(300, 80, 30, 0, 2*Math.PI); 
// ctx.closePath(); 
// ctx.stroke(); 

// ctx.beginPath(); 
// ctx.arc(500, 120, 30, 0, 2*Math.PI); 
// ctx.closePath(); 
// ctx.stroke(); 

// ctx.beginPath(); 
// ctx.arc(660, 200, 30, 0, 2*Math.PI); 
// ctx.closePath(); 
// ctx.stroke(); 

// ctx.beginPath(); 
// ctx.arc(720, 340, 30, 0, 2*Math.PI); 
// ctx.closePath(); 
// ctx.stroke(); 

// ctx.beginPath(); 
// ctx.arc(660, 480, 30, 0, 2*Math.PI); 
// ctx.closePath(); 
// ctx.stroke(); 

// ctx.beginPath(); 
// ctx.arc(500, 480, 30, 0, 2*Math.PI); 
// ctx.closePath(); 
// ctx.stroke(); 

// ctx.beginPath(); 
// ctx.arc(290, 530, 30, 0, 2*Math.PI); 
// ctx.closePath(); 
// ctx.stroke(); 

// ctx.beginPath(); 
// ctx.arc(90, 320, 30, 0, 2*Math.PI); 
// ctx.closePath(); 
// ctx.stroke(); 





// function printMousePos(e){
//     console.log(e.clientX, e.clientY); 
// }

// document.addEventListener('click', printMousePos); 


let characters = [juliet, romeo, friar, capulet, ladyCapulet, montague, ladyMontague, benvolio, nurse]; 

let connectionCharacters = [con1, con2, con3, con4, con5, con6, con7, con8,con9]; 



let submitCharacter = document.getElementById('submit-characters');




submitCharacter.onclick = function findCharacters(){
    let charactersToUse = []; 

    for (let i = 0; i<characters.length; i++) {
        character = characters[i]; 
        if(character.checked){
            charactersToUse.push(character.value); 
        }
    }


    if(charactersToUse.length > 0){
        console.log(charactersToUse); 
        // code after finding characters here 


        connectLabel.style.opacity = '100%'; // Put title for connections back 
        submitConnections.style.opacity = '100%'; //put submit button for connections back 

       
        useCharacterConnections = []; 
        useCharacterLabels = []; 

        for(let i = 0; i<charactersToUse.length; i++){
            useCharacterConnections.push(document.getElementById('con'+ (i+1))); 
            useCharacterLabels.push(document.getElementById('con' + (i+1) +  '-label')); 
        }

        for(let i = 0; i<useCharacterConnections.length; i++){
            useCharacterConnections[i].style.opacity = '100%'; 
            if(charactersToUse[i] == 'Lady Capulet'){
            useCharacterLabels[i].innerHTML = 'LadyCapulet'; 
            } 
            else if(charactersToUse[i] == 'Lady Montague'){
                useCharacterLabels[i].innerHTML = 'LadyMontague'; 
            }
            else{
                useCharacterLabels[i].innerHTML = charactersToUse[i]; 
            }
            useCharacterLabels[i].opacity = '100%'; 
        }

        submitConnections.onclick = function findConnections(){

            let allConnections = []; 
            let easyConnections = []; 

            for(let i = 0; i<useCharacterConnections.length; i++){
                let userConnection = useCharacterConnections[i].value; 
                let userConnectionLabel = useCharacterLabels[i].innerHTML; 
                let splitConnection = userConnection.split(" "); 
                let addConnection = []; 
                let add2Connection = [];
                
                addConnection.push(userConnectionLabel); 
                
                if(splitConnection.length > 0){
                for(let j = 0; j<splitConnection.length; j++){
                    let weightCharacter = splitConnection[j]; 
                    let seperateWeight = weightCharacter.split(":"); 
                    let weight = parseInt(seperateWeight[1]);
                    
                    if(seperateWeight[0] && weight){
                        add2Connection.push([seperateWeight[0], weight]); 
                    } 

                    easyConnections.push([userConnectionLabel, seperateWeight[0], weight]); 
                    


                }
                }

                addConnection.push(add2Connection); 

                

                

                allConnections.push(addConnection);
                
                 
            }

            console.log(allConnections); 

            // let d = [
            //     ['Romeo', [['Juliet', 10], ['Friar', 7]]],
            //     ['Juliet', [['Romeo', 10], ['Friar', 2]]],
            //     ['Friar', [['Juliet', 2], ['Romeo', 7]]]
            // ]; 

            // console.log("D", d); 

            
            let twoConnections = prompt('Which two characters do you want to find the shortest path between?'); 

            let twoCharacters = twoConnections.split(' '); 

            // characters in use under useCharacterLabels 

            let characterNumber = []; 
            


            if(twoCharacters){
            let d = new Dijkstras(); 
             d.setGraph(allConnections); 
             let shortPath = d.getPath(twoCharacters[0], twoCharacters[1]); 
             console.log(d.getPath(twoCharacters[0], twoCharacters[1])); 

             let numCharacters = useCharacterLabels.length; 

            // display character names in nodes
             for(let i=0; i<numCharacters; i++){
                 ctx.beginPath(); 
                 ctx.arc(graphCoordinates[i][0], graphCoordinates[i][1], 30, 0, Math.PI * 2); 
                 ctx.closePath(); 
                 ctx.stroke(); 

                 ctx.fillText(useCharacterLabels[i].innerHTML, graphCoordinates[i][0] - 25, graphCoordinates[i][1]); 

                 characterNumber.push([i, useCharacterLabels[i].innerHTML]);  


             }

             // connections 
             for(let i = 0; i<easyConnections.length; i++){
                 let source = easyConnections[i][0]; 
                 let end = easyConnections[i][1]; 
                 let numSource, numEnd; 

                 for(let j = 0; j<characterNumber.length; j++){
                     if(characterNumber[j][1] == source){
                         numSource = characterNumber[j][0]; 
                     }
                     else if(characterNumber[j][1] == end){
                         numEnd = characterNumber[j][0]; 
                     }
                 }

                 ctx.beginPath(); 
                 ctx.moveTo(graphCoordinates[numSource][0], graphCoordinates[numSource][1]); 
                 ctx.lineTo(graphCoordinates[numEnd][0], graphCoordinates[numEnd][1]); 
                 ctx.closePath(); 
                 ctx.stroke(); 


                
             }

             ctx.fillStyle = 'rgb(255,0,0)'; 
             ctx.strokeStyle = 'rgb(255,0,0)'; 

             for(let i = 1; i<shortPath.length; i++){
                
                let curNum; 
                let preNum; 
                for(let j = 0; j<characterNumber.length; j++){
                    if(characterNumber[j][1] == shortPath[i]){
                        curNum = characterNumber[j][0]; 
                    }
                    if(characterNumber[j][1] == shortPath[i-1]){
                        preNum = characterNumber[j][0]; 
                    }
                }

                ctx.beginPath(); 
                ctx.moveTo(graphCoordinates[preNum][0], graphCoordinates[preNum][1]); 
                ctx.lineTo(graphCoordinates[curNum][0], graphCoordinates[curNum][1]); 
                ctx.closePath(); 
                ctx.stroke(); 


                
             } 
             let startNum; 
             let secNum; 

             for(let i = 0; i<characterNumber.length; i++){
                 if(characterNumber[i][1] == twoCharacters[0]){
                    startNum = characterNumber[i][0]; 
                 }
                 if(characterNumber[i][1] == shortPath[0]){
                     secNum = characterNumber[i][0]; 
                 }
             }

             ctx.beginPath(); 
             ctx.moveTo(graphCoordinates[startNum][0], graphCoordinates[startNum][1]); 
             ctx.lineTo(graphCoordinates[secNum][0], graphCoordinates[secNum][1]); 
             ctx.closePath(); 
             ctx.stroke(); 

             ctx.fillStyle = ''; 
             ctx.strokeStyle = ''



            } 
           /*
            d.setGraph(
                [
                   ['A', [['B', 2], ['C', 2], ['D', 4]]],
                   ['B', [['A', 2], ['C', 6]]], 
                   ['C', [['A', 2], ['B', 6], ['D', 1]]], 
                   ['D', [['A', 4], ['C', 1]]]
                ]
             ); 
             */ 


        }



    }

} 







