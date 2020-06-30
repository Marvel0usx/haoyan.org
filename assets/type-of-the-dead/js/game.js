document.addEventListener("DOMContentLoaded", init);

var homePage, countDownPage, gamePage, winPage, losePage, statsDisplay;
var speedObj, rateObj;
var speed, rate;
var isRunning;

const dictionary = {
    "easy": ['bolster',
            'deride',
            'apathy',
            'adulterate',
            'obdurate',
            'ostentation',
            'laconic',
            'loquacious',
            'vacillate',
            'prevaricate',
            'antipathy',
            'opaque',
            'gullible',
            'homogenous',
            'ephemeral',
            'prodigal',
            'propriety',
            'dissonance',
            'zeal',
            'pragmatic',
            'lucid',
            'philanthropic',
            'misanthrope',
            'eulogy',
            'advocate',
            'enervate',
            'paradox',
            'lethargic',
            'enigma',
            'volatile',
            'equivocal',
            'cacophony',
            'erudite',
            'waver',
            'placate',
            'desiccate',
            'capricious',
            'abstain',
            'malleable',
            'corroborate',
            'garrulous',
            'assuage',
            'laudable',
            'ingenuous',
            'mitigate',
            'pedant',
            'venerate',
            'engender',
            'audacious',
            'fervid',
            'precipitate',
            'anomaly'],
    "mid": ['abduct',
        'abductor digiti minimi',
        'abductor pollicis brevis',
        'abductor pollicis longus',
        'abductor',
        'adductor brevis',
        'adductor longus',
        'adductor magnus',
        'adductor pollicis',
        'adductor',
        'agonist',
        'anal triangle',
        'anconeus',
        'antagonist',
        'anterior compartment of the arm',
        'anterior compartment of the forearm',
        'anterior compartment of the leg',
        'anterior compartment of the thigh',
        'anterior scalene',
        'appendicular',
        'axial',
        'belly',
        'bi',
        'biceps brachii',
        'biceps femoris',
        'bipennate',
        'brachialis',
        'brachioradialis',
        'brevis',
        'buccinator',
        'calcaneal tendon',
        'caval opening',
        'circular',
        'compressor urethrae',
        'convergent',
        'coracobrachialis',
        'corrugator supercilii',
        'deep anterior compartment',
        'deep posterior compartment of the forearm',
        'deep transverse perineal',
        'deglutition',
        'deltoid',
        'diaphragm',
        'digastric',
        'dorsal group',
        'dorsal interossei',
        'epicranial aponeurosis',
        'erector spinae group',
        'extensor carpi radialis brevis',
        'extensor carpi ulnaris',
        'extensor digiti minimi',
        'extensor digitorum brevis',
        'extensor digitorum longus',
        'extensor digitorum',
        'extensor hallucis longus',
        'extensor indicis',
        'extensor pollicis brevis',
        'extensor pollicis longus',
        'extensor radialis longus',
        'extensor retinaculum',
        'extensor',
        'external intercostal',
        'external oblique',
        'extrinsic eye muscles',
        'extrinsic muscles of the hand',
        'fascicle',
        'femoral triangle',
        'fibularis brevis',
        'fibularis longus',
        'fibularis tertius',
        'fixator',
        'flexion',
        'flexor carpi radialis',
        'flexor carpi ulnaris',
        'flexor digiti minimi brevis',
        'flexor digitorum longus',
        'flexor digitorum profundus',
        'flexor digitorum superficialis',
        'flexor hallucis longus',
        'flexor pollicis brevis',
        'flexor pollicis longus',
        'flexor retinaculum',
        'flexor',
        'frontalis',
        'fusiform',
        'gastrocnemius',
        'genioglossus',
        'geniohyoid',
        'gluteal group',
        'gluteus maximus',
        'gluteus medius',
        'gluteus minimus',
        'gracilis',
        'hamstring group',
        'hyoglossus',
        'hypothenar eminence',
        'hypothenar',
        'iliacus',
        'iliococcygeus',
        'iliocostalis cervicis',
        'iliocostalis group',
        'iliocostalis lumborum',
        'iliocostalis thoracis',
        'iliopsoas group',
        'iliotibial tract',
        'inferior extensor retinaculum',
        'inferior gemellus',
        'infrahyoid muscles',
        'infraspinatus',
        'innermost intercostal',
        'insertion',
        'intercostal muscles',
        'intermediate',
        'internal intercostal',
        'internal oblique',
        'intrinsic muscles of the hand',
        'ischiococcygeus',
        'lateral compartment of the leg',
        'lateral pterygoid',
        'lateralis',
        'latissimus dorsi',
        'levator ani',
        'linea alba',
        'longissimus capitis',
        'longissimus cervicis',
        'longissimus group',
        'longissimus thoracis',
        'longus',
        'lumbrical',
        'masseter',
        'mastication',
        'maximus',
        'medial compartment of the thigh',
        'medial pterygoid',
        'medialis',
        'medius',
        'middle scalene',
        'minimus',
        'multifidus',
        'multipennate',
        'mylohyoid',
        'oblique',
        'obturator externus',
        'obturator internus',
        'occipitalis',
        'occipitofrontalis',
        'omohyoid',
        'opponens digiti minimi',
        'opponens pollicis',
        'orbicularis oculi',
        'orbicularis oris',
        'origin',
        'palatoglossus',
        'palmar interossei',
        'palmaris longus',
        'parallel',
        'patellar ligament',
        'pectineus',
        'pectoral girdle',
        'pectoralis major',
        'pectoralis minor',
        'pelvic diaphragm',
        'pelvic girdle',
        'pennate',
        'perineum',
        'piriformis',
        'plantar aponeurosis',
        'plantar group',
        'plantaris',
        'popliteal fossa',
        'popliteus',
        'posterior compartment of the leg',
        'posterior compartment of the thigh',
        'posterior scalene',
        'prime mover',
        'pronator quadratus',
        'pronator teres',
        'psoas major',
        'pubococcygeus',
        'quadratus femoris',
        'quadratus lumborum',
        'quadriceps femoris group',
        'quadriceps tendon',
        'rectus abdominis',
        'rectus femoris',
        'rectus sheaths',
        'rectus',
        'retinacula',
        'rhomboid major',
        'rhomboid minor',
        'rotator cuff',
        'sartorius',
        'scalene muscles',
        'segmental muscle group',
        'semimembranosus',
        'semispinalis capitis',
        'semispinalis cervicis',
        'semispinalis thoracis',
        'semitendinosus',
        'serratus anterior',
        'soleus',
        'sphincter urethrovaginalis',
        'spinalis capitis',
        'spinalis cervicis',
        'spinalis group',
        'spinalis thoracis',
        'splenius capitis',
        'splenius cervicis',
        'splenius',
        'sternocleidomastoid',
        'sternohyoid',
        'sternothyroid',
        'styloglossus',
        'stylohyoid',
        'subclavius',
        'subscapularis',
        'superficial anterior compartment of the forearm',
        'superficial posterior compartment of the forearm',
        'superior extensor retinaculum',
        'superior gemellus',
        'supinator',
        'suprahyoid muscles',
        'supraspinatus',
        'synergist',
        'temporalis',
        'tendinous intersections',
        'tensor fascia lata',
        'teres major',
        'teres minor',
        'thenar eminence',
        'thenar',
        'thyrohyoid',
        'tibialis anterior',
        'tibialis posterior',
        'transversospinales',
        'transversus abdominis',
        'trapezius',
        'triceps brachii',
        'tri',
        'unipennate',
        'urogenital triangle',
        'vastus intermedius',
        'vastus lateralis',
        'vastus medialis'],
    "hard": ['Obdormition',
            'Borborygmus',
            'Xerosis',
            'Cerumen',
            'Sphenopalatine Ganglioneuralgia',
            'Morsicatio Buccarum',
            'Lachrymation',
            'Photalgia',
            'Epistaxis',
            'Pseudoepistaxis',
            'Proctalgia Fugax',
            'Xerostomia',
            'Pneumonoultramicroscopicsilicovolcanoconiosis',
            'Bruxism',
            'Horripilation',
            'Fasciculation',
            'Rhinorrhea',
            'Onychocryptosis',
            'Transient Diaphragmatic Spasm',
            'Aphthous Stomatitis',
            'Synchronous Diaphragmatic Flutter',
            'Formication',
            'Cardialgia',
            'Emesis',
            'Sternutate',
            'Gustatory Rhinitis',
            'Medial Tibial Stress Syndrome',
            'Veisalgia',
            'Muscae Volitantes',
            'Vasovagal Syncope',
            'Angina',
            'Varicella',
            'Odontalgia',
            'Pharyngitis',
            'Otalgia',
            'Cachexia',
            'Pyrexia',
            'Hyperhidrosis',
            'Heloma Molle',
            'Transient Lingual Papillitis',
            'Nocturnal Enuresis',
            'Crepitus',
            'Dysuria',
            'Bulla',
            'Diplopia',
            'Dysphagia',
            'Chalazion',
            'Pericoronitis',
            'Keratitis',
            'Oral Candidasis']
};

function init() {
    document.querySelector("#start-game").addEventListener("click", onCountDownPage);
    // setup DOM bindings
    homePage = document.querySelector("#home");
    countDownPage = document.querySelector("#countdown");
    gamePage = document.querySelector("#game");
    winPage = document.querySelector("#win");
    losePage = document.querySelector("#lose");
    statsDisplay = document.querySelector("#stats");
    speedObj = document.querySelector("#speed");
    rateObj = document.querySelector("#rate");

    // add keyboard event
    window.addEventListener("keydown", recordKey);
}

/*
 * Function that hendles activities in home page.
 */
function onCountDownPage() {
    setDisplay(homePage, "none");
    setDisplay(countDownPage, "block");
    countDown(3, document.querySelector("#seconds"), onGamePage);
}

/*
 * Display countdown in the given element and invoke callback.
 */
function countDown(seconds, element, callback) {
    var countdown = setInterval(function() {
        seconds--;
        element.textContent = seconds;
        if (seconds <= 0) {
            clearInterval(countdown);
            callback();
        }
    }, 1000);
}

/*
 * Helper funtion that toggles display.
 */
function setDisplay(frame, mode) {
    frame.style.display = mode;
}

/*
 * Function that handles typing and updates statistics.
 */
function onGamePage() {
    setDisplay(countDownPage, "none");
    setDisplay(gamePage, "block");
    setDisplay(statsDisplay, "flex");
    mainloop();
}

function mainloop() {
    var sel = document.querySelector("select#diff-select");
    var difficulty = sel.options[sel.selectedIndex].value;
    alert(typeof difficulty);
    isRunning = true;
    gamePage.querySelector("#level");
    gamePage.querySelector("#prompt");
    gamePage.querySelector("#time");
    gamePage.querySelector("#typed");

}

function recordKey(evt) {
    if (!isRunning)
        return;
    var display = "Key pressed: " + evt.key + "\tKey Code: " + evt.keyCode +
        "\tModifier: ";
    
  
}

