'use strict';
//model
let modelData = {
    nasaAPICallData: {
        callRoot: 'https://images-api.nasa.gov/search',
        q: '',
        media_type: 'image'
    },
    nasaImageData: {
        items: [] 
    }
};

//mv
let updateData = {
    storeNasaData: function(data){
        
        if(data.collection.items.length === 0){
            clientView.errorPage('no items');
        }
        else {
            data.collection.items.forEach(item => modelData.nasaImageData.items.push({src: item.links[0].href, alt: `${item.data[0].title} from ${item.data[0].secondary_creator}`}));
        }
    },
    resetSearchResults: function(){
        modelData.nasaImageData.items = [];
        $('.nasaImgResultsBox').empty();
    }
}

//view
let clientView = {
    initializeListeners: function(){
        $('.homeSearchForm').on('submit', function(e){
            e.preventDefault();
            updateData.resetSearchResults();
            let query = $('.homeSearchForm').find("#searchInput").val();
            clientView.callNasaAPI(query);
            clientView.initializeDesignContainer();
        });
        $('.nasaImgResultsBox').on('click', '.nasaScrollImg', function(e){
            e.preventDefault();
            e.stopPropagation();
            //clear canvas
            let canvas = document.getElementById('previewDisplay');
            let context = canvas.getContext('2d');
            context.clearRect(0, 0, canvas.width, canvas.height);

            let imgTarget = event.target;
            clientView.populateDesignPreview(imgTarget);
        });
    },
    callNasaAPI: function(q){
        modelData.nasaAPICallData.q = `q=${q}&media_type=image`;
        $.getJSON(modelData.nasaAPICallData.callRoot, modelData.nasaAPICallData.q, updateData.storeNasaData)
        .fail(function(err){
            clientView.errorPage(err);
          });
    },
    initializeDesignContainer: function(){
        $('.designContainer').show();
        //instead of timer, figure out to how have this load after data is gathered
        setTimeout(function(){ 
            if (modelData.nasaImageData.items.length > 0){
                clientView.populateImageScroll(); 
            }}, 1000);
    },
    populateImageScroll: function(){
        for(let i=0; i < 10; i++){
           let imgObject = modelData.nasaImageData.items[i];
           $('.nasaImgResultsBox').append(`<img class='nasaScrollImg' id='${i}' src='${imgObject.src}' alt='${imgObject.alt}'>`);
        }
    },
    populateDesignPreview: function(img){
        let canvas = document.getElementById('previewDisplay');
        let ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = false;
        let imageObj = new Image();
        imageObj.src = img.src;

        let newCanvasDim = this.calcAspectRatio(img);
        canvas.width = newCanvasDim.newW;
        canvas.height = newCanvasDim.newH;
        imageObj.onload = function(){
            ctx.drawImage(this, 0, 0, img.naturalWidth, img.naturalHeight, 0, 0, newCanvasDim.newW, newCanvasDim.newH);
        };
    },
    calcAspectRatio: function(img){
        let drawWidth = $('.displayContainer').width();
        let initialImgH = img.naturalHeight;
        let initialImgW = img.naturalWidth;
        let adjustedH = drawWidth * (initialImgH/initialImgW);
        return {newH: adjustedH, newW: drawWidth};
    },
    errorPage: function(e){
        if( e === 'no items'){
            $('.nasaImgResultsBox').append(`<p>Uh oh, looks like we can't find anything that matches that search! Try again.</p>`);
        }
        console.log(e);
    }
};

$(clientView.initializeListeners());