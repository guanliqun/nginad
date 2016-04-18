var nativePreviewTitleText = 'Learn about this awesome thing';
var nativePreviewDescriptionText = 'Learn all about this awesome story of someone using my product.';
var nativePreviewSponsoredText = 'My Brand';
var nativePreviewDefaultImageUrl = '/images/media-library/native.default.img.jpg';
var nativePreviewDefaultVideoUrl = '/images/media-library/native.default.video.jpg';
var nativePreviewDefaultTargetUrl = 'http://www.example.com/landing-page.html';

var dataTypeList = {
		"1"	: { "Label" : "Sponsored", "DataLabel" : "Sponsored",  "DefaultDataValue" : nativePreviewSponsoredText },
		"2"	: { "Label" : "Description", "DataLabel" : "Description",  "DefaultDataValue" : nativePreviewDescriptionText },
		"3"	: { "Label" : "Rating", "DataLabel" : "Rating",  "DefaultDataValue" : "5 Stars" },
		"4" : { "Label" : "Likes", "DataLabel" : "Likes",  "DefaultDataValue" : "9999" },
		"5"	: { "Label" : "Downloads", "DataLabel" : "Downloads",  "DefaultDataValue" : "9999" },
		"6"	: { "Label" : "Price", "DataLabel" : "Price",  "DefaultDataValue" : "$19.95" },
		"7 ": { "Label" : "Sales Price", "DataLabel" : "Sales Price",  "DefaultDataValue" : "$14.95" },
		"8"	: { "Label" : "Phone", "DataLabel" : "Phone",  "DefaultDataValue" : "555-555-5555" },
		"9" : { "Label" : "Address", "DataLabel" : "Address",  "DefaultDataValue" : "24 Test Street" },
		"10" : { "Label" : "Description 2", "DataLabel" : "Description 2",  "DefaultDataValue" : "This product is simply the best in it's category." },
		"11" : { "Label" : "Display URL", "DataLabel" : "Display URL",  "DefaultDataValue" : "http://www.product.com" },
		"12" : { "Label" : "CTA Description", "DataLabel" : "Call To Action Button",  "DefaultDataValue" : "Click Here to Buy" },
};

/* set up default data types */
var dataTypeAddedSet = {
		"1"	: true,
		"2"	: true
};

var dataTypeAddedSetId = { };
		
function updateImageAd() {
	
	var imageAdUrl = $("#imageurl").val().trim();

	if (!imageAdUrl) {
		imageAdUrl = nativePreviewDefaultImageUrl;
	}
	
	$('#native-preview-image img').attr('src', imageAdUrl);

}

function initializeNativeDataAssets() {
	
	if (!native_ad_data_json || native_ad_data_json == "") return;
	
	var nativeAdDataList = jQuery.parseJSON(native_ad_data_json);

	for (i = 0; i < nativeAdDataList.length; i++) {

		initializeDataAsset(nativeAdDataList[i]);
	    
	}
}

function initializeDataAsset(nativeAdData) {

    var assetRequired 						= nativeAdData.AssetRequired;
    var assetType 							= nativeAdData.AssetType;
    var dataType 							= nativeAdData.DataType;
    var dataLabel 							= nativeAdData.DataLabel;
    var dataValue 							= nativeAdData.DataValue;
    
	if (assetType == 'title') {
    	var titleText 						= nativeAdData.TitleText;
    	if (titleText) {
    		$('#data_title').val(titleText);
    	}
    	updateTitle();
	} else if (assetType == 'image') {
    	var imageUrl 						= nativeAdData.ImageUrl;
    	if (imageUrl) {
    		$('#imageurl').val(imageUrl);
    	}
    	$("#MediaType").val('image');
    	switchMediaType();
    } else if (assetType == 'video') {
    	var videoVastTag 						= nativeAdData.VideoVastTag;
    	var videoDuration 						= nativeAdData.VideoDuration;
    	var videoMimesCommaSeparated 			= nativeAdData.VideoMimesCommaSeparated;
    	var videoProtocolsCommaSeparated 		= nativeAdData.VideoProtocolsCommaSeparated;
    	
    	if (videoVastTag) {
    		$('#video_vast_tag').val(decodeURIComponent(videoVastTag));
    	}
    	if (videoDuration) {
    		$('#video_duration').val(videoDuration);
    	}
    	if (videoMimesCommaSeparated) {
	    	var videoMimes = videoMimesCommaSeparated.split(",");
	    	
	    	if (videoMimes.length > 0) {
	    		for (x in VideoMimes) {
	    			$("#video_mimes option[value='" + videoMimes[x] + "']").prop("selected", true);
	    		}
	    	}
    	}
    	if (videoProtocolsCommaSeparated) {
	    	var videoProtocols = videoProtocolsCommaSeparated.split(",");
	    	
	    	if (videoProtocols.length > 0) {
	    		for (x in VideoProtocols) {
	    			$("#video_protocols option[value='" + videoProtocols[x] + "']").prop("selected", true);
	    		}
	    	}
    	}
    	$("#MediaType").val('video');
    	switchMediaType();
    } else if (assetType == 'data' && dataType == 1) {
    	// sponsored
    	$('#data_sponsored').val(dataValue);
    	updateSponsored();
    } else if (assetType == 'data' && dataType == 2) {
    	// description
    	$('#data_description').val(dataValue);
    	updateDescription();
    } else {
    	
	    var id = newDataElement(null, dataType);
	    
	    if (dataType) {
	    	$("#AttributeType" + id).val(dataType);
		}
	    
		if (dataLabel) {
			$("#DataLabel" + id).val(dataLabel);
		}
	    	
		if (dataValue) {
			$("#DataValue" + id).val(dataValue);
		}
	    
	    if (assetRequired && assetRequired == 1) {
	    	$("#DataRequiredContainer" + id + ' .required-on').prop("checked", true);
	    } else {
	    	$("#DataRequiredContainer" + id + ' .required-off').prop("checked", true);
	    }
	    
	    updateDynamicLabel(id, dataType);
		updateDynamicValue(id, dataType);
	    
    }

}

function removeDataElement(id) {
	
	$("#n-data-id-" + id).remove();
	$("#data-tpl-preview-" + id).remove();
	
	if (dataTypeAddedSetId[id]) {
		var dataType = dataTypeAddedSetId[id];
		if (dataTypeAddedSet[dataType]) {
			delete dataTypeAddedSet[dataType];
		}
		delete dataTypeAddedSetId[id];
	}
	
}

function newDataElement(id, dataType, div, parentId) {
	
	if (!dataType) {
		dataType = $("#AttributeType").val();
	}
	
	if (dataTypeAddedSet[dataType]) {
		/* it was already added */
		return;
	}
	
	var dataTypeLabel = dataTypeList[dataType].Label;
	var dataTypeDataLabel = dataTypeList[dataType].DataLabel;
	var dataTypeDefaultDataValue = dataTypeList[dataType].DefaultDataValue;
	
	var divHtml = $("#data-template").html();
	
	if (!id) {
		id = newDataId();
	}
	
	divHtml = replaceAll("_N_", id, divHtml);
	
	divHtml = '<div class="n-data native-' + dataType + '" id="n-data-id-' + id + '">' + divHtml + '</div>';
	
	if (!div) {
		$("#native-data").append(divHtml);
	} else {
		div.append(divHtml);
	}
	
	$('#n-data-id-' + id + ' .dataplt-title').html('Add ' + dataTypeLabel);
	$('#n-data-id-' + id + ' .dataplt-label').html(dataTypeLabel + ' Label');
	$('#DataLabel' + id).attr('placeholder', dataTypeDataLabel);
	$('#n-data-id-' + id + ' .dataplt-value').html(dataTypeLabel + ' Value');
	$('#DataValue' + id).attr('placeholder', dataTypeDefaultDataValue);
	$('#DataType' + id).val(dataType);
	
	var previewDivHtml = $("#data-template-preview").html();
	
	previewDivHtml = replaceAll("_N_", id, previewDivHtml);
	previewDivHtml = replaceAll("_LABEL_", dataTypeLabel + ':', previewDivHtml);
	previewDivHtml = replaceAll("_VALUE_", dataTypeDefaultDataValue, previewDivHtml);
	
	$("#native-preview-sponsored").before(previewDivHtml);
	
	$('#DataLabel' + id).keyup(function(){
		updateDynamicLabel(id, dataType);
	});
	
	$('#DataValue' + id).keyup(function(){
		updateDynamicValue(id, dataType);
	});
	
	dataTypeAddedSet[dataType] 	= true;
	dataTypeAddedSetId[id]		= dataType;
	
	return id;
}

function replaceAll(find, replace, str) {
	  return str.replace(new RegExp(find, 'g'), replace);
}

function newDataId() {
	var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
	var length = 16;
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
    return '_NEW_' + result;
}

function scrollPreviewToViewport() {
	var aTop = 180;

	if($(this).scrollTop() >= aTop) {
		$('#floating-preview-pane').css('margin-top', $(this).scrollTop() - aTop);
	}
}

function switchMediaType() {
	
	var mediaType = $("#MediaType").val();
	
	if (mediaType == 'video') {
		
		$("#media-type-image").hide();
		$("#media-type-video").show();
		
		$('#native-preview-image img').attr('src', nativePreviewDefaultVideoUrl);
		
	} else {
		
		$("#media-type-video").hide();
		$("#media-type-image").show();
		
		updateImageAd();
		
	}
}

function updateTitle() {
	var txt = $('#data_title').val();
	if (!txt) {
		txt = nativePreviewTitleText;
	}
	$('#native-preview-title').html(txt);
}

function updateDescription() {
	var txt = $('#data_description').val();
	if (!txt) {
		txt = nativePreviewDescriptionText;
	}
	$('#native-preview-description').html(txt);
}

function updateSponsored() {
	var txt = $('#data_sponsored').val();
	if (!txt) {
		txt = nativePreviewSponsoredText;
	}
	$('#native-preview-brand').html(txt);
}

function updateLandingPageUrl() {
	var url = $('#landingpageurl').val();
	if (!url) {
		url = nativePreviewDefaultTargetUrl;
	}
	$('#native-preview-image .preview-target-link').attr('href', url);
}

function updateDynamicLabel(id, dataType) {
	
	var dataTypeLabel = dataTypeList[dataType].Label;
	var txt = $('#DataLabel' + id).val();
	if (!txt) {
		txt = dataTypeLabel + ':';
	}
	$('#data-tpl-preview-' + id + ' .tpl-data-preview-label').html(txt + ':');
}

function updateDynamicValue(id, dataType) {
	
	var dataTypeDataLabel = dataTypeList[dataType].DataLabel;
	var txt = $('#DataValue' + id).val();
	if (!txt) {
		txt = dataTypeValue + ':';
	}
	$('#data-tpl-preview-' + id + ' .tpl-data-preview-value').html(txt);
}

$().ready(function() {
	
	$('#data_title').keyup(function(){
		updateTitle();
	});
	
	$('#data_description').keyup(function(){
		updateDescription();
	});
	
	$('#data_sponsored').keyup(function(){
		updateSponsored();
	});
	
	$('#landingpageurl').keyup(function(){
		updateLandingPageUrl();
	});

	$(window).scroll(function(){
		scrollPreviewToViewport();
	});

	scrollPreviewToViewport();
});
	