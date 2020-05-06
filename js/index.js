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
        console.log(data);
        data.collection.items.forEach(item => modelData.nasaImageData.items.push({src: item.links[0].href, alt: item.data[0].description}));
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
    },
    callNasaAPI: function(q){
        modelData.nasaAPICallData.q = `title=${q}&media_type=image`;
        $.getJSON(modelData.nasaAPICallData.callRoot, modelData.nasaAPICallData.q, updateData.storeNasaData)
        .fail(function(err){
            clientView.errorPage(err);
          });
    },
    initializeDesignContainer: function(){
        $('.designContainer').show();
        //instead of timer, figure out to how have this load after data is gathered
        setTimeout(function(){ clientView.populateImageScroll(); }, 500);
    },
    populateImageScroll: function(){
        for(let i=0; i < 10; i++){
           let imgObject = modelData.nasaImageData.items[i];
           $('.nasaImgResultsBox').append(`<img class='nasaScrollImg' src='${imgObject.src}' alt='${imgObject.alt}'>`);
        }
    },
    errorPage: function(e){
        console.log(e);
    }
};

$(clientView.initializeListeners());