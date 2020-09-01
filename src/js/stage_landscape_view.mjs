// Import modules
import { DEBUG, BLINDFOLD_FADE_DURATION } from './constants.mjs';
import { get_svg, get_svg_height } from './utilities.mjs';

// Import third party libraries
import anime from 'animejs/lib/anime.es.js';

function start() {
    $('#stage-landscape-view').removeClass('hidden');
    animate_landscape_view();
}

function animate_landscape_view() {
    if (DEBUG) {
        console.log('Landscape view loaded.');
    }
    var svg_container = document.getElementById('landscape-view');
    var svg = get_svg('landscape-view');
    var container_height = $('#animation-container').height();
    var plains = svg.querySelector('#plains');
    var river = svg.querySelector('#river');
    var forest_layer_far = svg.querySelector('#forest-layer-far');
    var forest_layer_close = svg.querySelector('#forest-layer-close');
    var landscape_layers = [
        plains,
        river,
        forest_layer_far,
        forest_layer_close,
    ];

    // Move elements down
    var layer_down_amount = container_height * .5;
    if (DEBUG) {
        console.log('Moving landscape layers down by: ' + layer_down_amount + 'px.');
    }
    anime({
        targets: landscape_layers,
        translateY: layer_down_amount,
        duration: 0
    });

    var text_duration = 4000;
    var delay_duration = (BLINDFOLD_FADE_DURATION + text_duration) * .9;
    var animation_duration = 30000;
    var parallax_animation_duration = 0.4 * animation_duration;

    $('#animation-blindfold').fadeOut(BLINDFOLD_FADE_DURATION);
    //Show UI elements
    display_landscape_ui_1(BLINDFOLD_FADE_DURATION, text_duration);

    // Animate whole SVG upwards, with parallax effect on layers.
    var landscape_timeline = anime.timeline({
        duration: parallax_animation_duration,
        easing: 'easeOutQuad',
        delay: delay_duration,
    });
    landscape_timeline.add({
        targets: svg_container,
        translateY: '-82.3%',
        duration: animation_duration,
        easing: 'easeInOutSine',
        complete: display_landscape_ui_2
    })
    .add({
        targets: plains,
        translateY: 0,
    }, animation_duration * 0.04)
    .add({
        targets: river,
        translateY: 0,
    }, animation_duration * 0.25)
    .add({
        targets: forest_layer_far,
        translateY: 0,
    }, animation_duration * 0.42)
    .add({
        targets: forest_layer_close,
        translateY: 0,
    }, animation_duration * 0.55);
}


function display_landscape_ui_1(fade_out_duration, text_duration) {
    console.log('Displaying Landscape View UI - 1.');
    var ui_elements = document.getElementById('landscape-ui-1').children;
    $(ui_elements).css('visibility', 'visible');
    var ui_timeline = anime.timeline({
        easing: 'linear',
    });
    ui_timeline.add({
        targets: ui_elements,
        opacity: 1,
        duration: 1000,
        delay: fade_out_duration,
        easing: 'linear'
    })
    .add({
        targets: ui_elements,
        opacity: 0,
        duration: 1000,
        delay: anime.stagger(750),
        easing: 'linear'
    }, '+=' + text_duration);
}

function display_landscape_ui_2() {
    console.log('Displaying Landscape View UI - 2.');
    var ui_elements = document.getElementById('landscape-ui-2').children;
    $(ui_elements).css('visibility', 'visible');
    anime({
        targets: ui_elements,
        opacity: 1,
        duration: 1000,
        delay: anime.stagger(750),
        easing: 'linear'
    });
    $('#landscape-stage-end').on('click', function () {
        $('#animation-blindfold').fadeIn(BLINDFOLD_FADE_DURATION, end);
    });
}


function end() {
    $('#stage-landscape-view').addClass('hidden');
    var animation_container = document.getElementById('animation-container');
    var advance_event = new Event('journey:advance_stage');
    animation_container.dispatchEvent(advance_event);
}

export { start };
