import {
  Certification,
  legacyCertifications,
  upcomingCertifications,
  currentCertifications
} from '../../shared/config/certification-settings';
import config from '../config/env.json';

const { showUpcomingChanges } = config;

const responsiveWebBase =
  '/learn/responsive-web-design/responsive-web-design-projects';
const responsiveWeb22Base = '/learn/2022/responsive-web-design';
const jsAlgoBase =
  '/learn/javascript-algorithms-and-data-structures/' +
  'javascript-algorithms-and-data-structures-projects';
const jsAlgo22Base = '/learn/javascript-algorithms-and-data-structures-v8';
const feLibsBase =
  '/learn/front-end-development-libraries/front-end-development-libraries-projects';
const dataVisBase = '/learn/data-visualization/data-visualization-projects';
const relationalDatabaseBase = '/learn/relational-database';
const apiMicroBase =
  '/learn/back-end-development-and-apis/back-end-development-and-apis-projects';
const qaBase = '/learn/quality-assurance/quality-assurance-projects';
const infoSecBase = '/learn/information-security/information-security-projects';
const sciCompPyBase = '/learn/scientific-computing-with-python';
const dataAnalysisPyBase =
  '/learn/data-analysis-with-python/data-analysis-with-python-projects';
const machineLearningPyBase =
  '/learn/machine-learning-with-python/machine-learning-with-python-projects';
const collegeAlgebraPyBase = '/learn/college-algebra-with-python';
const takeHomeBase = '/learn/coding-interview-prep/take-home-projects';
const foundationalCSharpBase =
  '/learn/foundational-c-sharp-with-microsoft/foundational-c-sharp-with-microsoft-certification-exam';
const fullStackDeveloperBase = '/learn/full-stack-developer';
const a2EnglishBase = '/learn/a2-english-for-developers';
const b1EnglishBase = '/learn/b1-english-for-developers';
const legacyFrontEndBase = feLibsBase;
const legacyFrontEndResponsiveBase = responsiveWebBase;
const legacyFrontEndTakeHomeBase = takeHomeBase;
const legacyBackEndBase = apiMicroBase;
const legacyBackEndTakeHomeBase = takeHomeBase;
const legacyDataVisBase = dataVisBase;
const legacyDataVisFrontEndBase = feLibsBase;
const legacyDataVisTakeHomeBase = takeHomeBase;
const legacyInfosecQaQaBase = qaBase;
const legacyInfosecQaInfosecBase = infoSecBase;

// TODO: generate this automatically in a separate file
// from the md/meta.json files for each cert and projects
const fullstackCert = {
  id: '561add10cb82ac38a17213bd',
  title: 'Legacy Full Stack',
  certSlug: Certification.LegacyFullStack,
  projects: null
  // Requirements are other certs and is
  // handled elsewhere
} as const;
const allStandardCerts = [
  {
    id: '561add10cb82ac38a17513bc',
    title: 'Responsive Web Design',
    certSlug: Certification.RespWebDesign,
    projects: [
      {
        id: '587d78af367417b2b2512b03',
        title: 'Build a Survey Form',
        link: getResponsiveWebDesignPath('build-a-survey-form'),
        certSlug: Certification.RespWebDesign
      },
      {
        id: 'bd7158d8c442eddfaeb5bd18',
        title: 'Build a Tribute Page',
        link: getResponsiveWebDesignPath('build-a-tribute-page'),
        certSlug: Certification.RespWebDesign
      },
      {
        id: '587d78b0367417b2b2512b05',
        title: 'Build a Technical Documentation Page',
        link: getResponsiveWebDesignPath(
          'build-a-technical-documentation-page'
        ),
        certSlug: Certification.RespWebDesign
      },
      {
        id: '587d78af367417b2b2512b04',
        title: 'Build a Product Landing Page',
        link: getResponsiveWebDesignPath('build-a-product-landing-page'),
        certSlug: Certification.RespWebDesign
      },
      {
        id: 'bd7158d8c242eddfaeb5bd13',
        title: 'Build a Personal Portfolio Webpage',
        link: getResponsiveWebDesignPath('build-a-personal-portfolio-webpage'),
        certSlug: Certification.RespWebDesign
      }
    ]
  },
  {
    id: '658180220947283cdc0689ce',
    title: 'JavaScript Algorithms and Data Structures',
    certSlug: Certification.JsAlgoDataStructNew,
    projects: [
      {
        id: '657bdc55a322aae1eac3838f',
        title: 'Build a Palindrome Checker',
        link: getJavaScriptAlgoPath('build-a-palindrome-checker'),
        certSlug: Certification.JsAlgoDataStructNew
      },
      {
        id: '657bdc8ba322aae1eac38390',
        title: 'Build a Roman Numeral Converter',
        link: getJavaScriptAlgoPath('build-a-roman-numeral-converter'),
        certSlug: Certification.JsAlgoDataStructNew
      },
      {
        id: '657bdcb9a322aae1eac38391',
        title: 'Build a Telephone Number Validator',
        link: getJavaScriptAlgoPath('build-a-telephone-number-validator'),
        certSlug: Certification.JsAlgoDataStructNew
      },
      {
        id: '657bdcc3a322aae1eac38392',
        title: 'Build a Cash Register',
        link: getJavaScriptAlgoPath('build-a-cash-register'),
        certSlug: Certification.JsAlgoDataStructNew
      },
      {
        id: '6555c1d3e11a1574434cf8b5',
        title: 'Build an RPG Creature Search App',
        link: getJavaScriptAlgoPath('build-an-rpg-creature-search-app'),
        certSlug: Certification.JsAlgoDataStructNew
      }
    ]
  },
  {
    id: '561acd10cb82ac38a17513bc',
    title: 'Front End Development Libraries',
    certSlug: Certification.FrontEndDevLibs,
    projects: [
      {
        id: 'bd7158d8c442eddfaeb5bd13',
        title: 'Build a Random Quote Machine',
        link: `${feLibsBase}/build-a-random-quote-machine`,
        certSlug: Certification.FrontEndDevLibs
      },
      {
        id: 'bd7157d8c242eddfaeb5bd13',
        title: 'Build a Markdown Previewer',
        link: `${feLibsBase}/build-a-markdown-previewer`,
        certSlug: Certification.FrontEndDevLibs
      },
      {
        id: '587d7dbc367417b2b2512bae',
        title: 'Build a Drum Machine',
        link: `${feLibsBase}/build-a-drum-machine`,
        certSlug: Certification.FrontEndDevLibs
      },
      {
        id: 'bd7158d8c442eddfaeb5bd17',
        title: 'Build a JavaScript Calculator',
        link: `${feLibsBase}/build-a-javascript-calculator`,
        certSlug: Certification.FrontEndDevLibs
      },
      {
        id: 'bd7158d8c442eddfaeb5bd0f',
        title: 'Build a 25 + 5 Clock',
        link: `${feLibsBase}/build-a-25--5-clock`,
        certSlug: Certification.FrontEndDevLibs
      }
    ]
  },
  {
    id: '5a553ca864b52e1d8bceea14',
    title: 'Data Visualization',
    certSlug: Certification.DataVis,
    projects: [
      {
        id: 'bd7168d8c242eddfaeb5bd13',
        title: 'Visualize Data with a Bar Chart',
        link: `${dataVisBase}/visualize-data-with-a-bar-chart`,
        certSlug: Certification.DataVis
      },
      {
        id: 'bd7178d8c242eddfaeb5bd13',
        title: 'Visualize Data with a Scatterplot Graph',
        link: `${dataVisBase}/visualize-data-with-a-scatterplot-graph`,
        certSlug: Certification.DataVis
      },
      {
        id: 'bd7188d8c242eddfaeb5bd13',
        title: 'Visualize Data with a Heat Map',
        link: `${dataVisBase}/visualize-data-with-a-heat-map`,
        certSlug: Certification.DataVis
      },
      {
        id: '587d7fa6367417b2b2512bbf',
        title: 'Visualize Data with a Choropleth Map',
        link: `${dataVisBase}/visualize-data-with-a-choropleth-map`,
        certSlug: Certification.DataVis
      },
      {
        id: '587d7fa6367417b2b2512bc0',
        title: 'Visualize Data with a Treemap Diagram',
        link: `${dataVisBase}/visualize-data-with-a-treemap-diagram`,
        certSlug: Certification.DataVis
      }
    ]
  },
  {
    id: '606243f50267e718b1e755f4',
    title: 'Relational Database',
    certSlug: Certification.RelationalDb,
    projects: [
      {
        id: '5f1a4ef5d5d6b5ab580fc6ae',
        title: 'Celestial Bodies Database',
        link: `${relationalDatabaseBase}/build-a-celestial-bodies-database-project/build-a-celestial-bodies-database`,
        certSlug: Certification.RelationalDb
      },
      {
        id: '5f9771307d4d22b9d2b75a94',
        title: 'World Cup Database',
        link: `${relationalDatabaseBase}/build-a-world-cup-database-project/build-a-world-cup-database`,
        certSlug: Certification.RelationalDb
      },
      {
        id: '5f87ac112ae598023a42df1a',
        title: 'Salon Appointment Scheduler',
        link: `${relationalDatabaseBase}/build-a-salon-appointment-scheduler-project/build-a-salon-appointment-scheduler`,
        certSlug: Certification.RelationalDb
      },
      {
        id: '602d9ff222201c65d2a019f2',
        title: 'Periodic Table Database',
        link: `${relationalDatabaseBase}/build-a-periodic-table-database-project/build-a-periodic-table-database`,
        certSlug: Certification.RelationalDb
      },
      {
        id: '602da04c22201c65d2a019f4',
        title: 'Number Guessing Game',
        link: `${relationalDatabaseBase}/build-a-number-guessing-game-project/build-a-number-guessing-game`,
        certSlug: Certification.RelationalDb
      }
    ]
  },
  {
    id: '561add10cb82ac38a17523bc',
    title: 'Back End Development and APIs',
    certSlug: Certification.BackEndDevApis,
    projects: [
      {
        id: 'bd7158d8c443edefaeb5bdef',
        title: 'Timestamp Microservice',
        link: `${apiMicroBase}/timestamp-microservice`,
        certSlug: Certification.BackEndDevApis
      },
      {
        id: 'bd7158d8c443edefaeb5bdff',
        title: 'Request Header Parser Microservice',
        link: `${apiMicroBase}/request-header-parser-microservice`,
        certSlug: Certification.BackEndDevApis
      },
      {
        id: 'bd7158d8c443edefaeb5bd0e',
        title: 'URL Shortener Microservice',
        link: `${apiMicroBase}/url-shortener-microservice`,
        certSlug: Certification.BackEndDevApis
      },
      {
        id: '5a8b073d06fa14fcfde687aa',
        title: 'Exercise Tracker',
        link: `${apiMicroBase}/exercise-tracker`,
        certSlug: Certification.BackEndDevApis
      },
      {
        id: 'bd7158d8c443edefaeb5bd0f',
        title: 'File Metadata Microservice',
        link: `${apiMicroBase}/file-metadata-microservice`,
        certSlug: Certification.BackEndDevApis
      }
    ]
  },
  {
    id: '5e611829481575a52dc59c0e',
    title: 'Quality Assurance',
    certSlug: Certification.QualityAssurance,
    projects: [
      {
        id: '587d8249367417b2b2512c41',
        title: 'Metric-Imperial Converter',
        link: `${qaBase}/metric-imperial-converter`,
        certSlug: Certification.QualityAssurance
      },
      {
        id: '587d8249367417b2b2512c42',
        title: 'Issue Tracker',
        link: `${qaBase}/issue-tracker`,
        certSlug: Certification.QualityAssurance
      },
      {
        id: '587d824a367417b2b2512c43',
        title: 'Personal Library',
        link: `${qaBase}/personal-library`,
        certSlug: Certification.QualityAssurance
      },
      {
        id: '5e601bf95ac9d0ecd8b94afd',
        title: 'Sudoku Solver',
        link: `${qaBase}/sudoku-solver`,
        certSlug: Certification.QualityAssurance
      },
      {
        id: '5e601c0d5ac9d0ecd8b94afe',
        title: 'American British Translator',
        link: `${qaBase}/american-british-translator`,
        certSlug: Certification.QualityAssurance
      }
    ]
  },
  {
    id: '5e44431b903586ffb414c951',
    title: 'Scientific Computing with Python',
    certSlug: Certification.SciCompPy,
    projects: [
      {
        id: '5e44412c903586ffb414c94c',
        title: 'Arithmetic Formatter',
        link: `${sciCompPyBase}/build-an-arithmetic-formatter-project/build-an-arithmetic-formatter-project`,
        certSlug: Certification.SciCompPy
      },
      {
        id: '5e444136903586ffb414c94d',
        title: 'Time Calculator',
        link: `${sciCompPyBase}/build-a-time-calculator-project/build-a-time-calculator-project`,
        certSlug: Certification.SciCompPy
      },
      {
        id: '5e44413e903586ffb414c94e',
        title: 'Budget App',
        link: `${sciCompPyBase}/build-a-budget-app-project/build-a-budget-app-project`,
        certSlug: Certification.SciCompPy
      },
      {
        id: '5e444147903586ffb414c94f',
        title: 'Polygon Area Calculator',
        link: `${sciCompPyBase}/build-a-polygon-area-calculator-project/build-a-polygon-area-calculator-project`,
        certSlug: Certification.SciCompPy
      },
      {
        id: '5e44414f903586ffb414c950',
        title: 'Probability Calculator',
        link: `${sciCompPyBase}/build-a-probability-calculator-project/build-a-probability-calculator-project`,
        certSlug: Certification.SciCompPy
      }
    ]
  },
  {
    id: '5e46fc95ac417301a38fb934',
    title: 'Data Analysis with Python',
    certSlug: Certification.DataAnalysisPy,
    projects: [
      {
        id: '5e46f7e5ac417301a38fb928',
        title: 'Mean-Variance-Standard Deviation Calculator',
        link: `${dataAnalysisPyBase}/mean-variance-standard-deviation-calculator`,
        certSlug: Certification.DataAnalysisPy
      },
      {
        id: '5e46f7e5ac417301a38fb929',
        title: 'Demographic Data Analyzer',
        link: `${dataAnalysisPyBase}/demographic-data-analyzer`,
        certSlug: Certification.DataAnalysisPy
      },
      {
        id: '5e46f7f8ac417301a38fb92a',
        title: 'Medical Data Visualizer',
        link: `${dataAnalysisPyBase}/medical-data-visualizer`,
        certSlug: Certification.DataAnalysisPy
      },
      {
        id: '5e46f802ac417301a38fb92b',
        title: 'Page View Time Series Visualizer',
        link: `${dataAnalysisPyBase}/page-view-time-series-visualizer`,
        certSlug: Certification.DataAnalysisPy
      },
      {
        id: '5e4f5c4b570f7e3a4949899f',
        title: 'Sea Level Predictor',
        link: `${dataAnalysisPyBase}/sea-level-predictor`,
        certSlug: Certification.DataAnalysisPy
      }
    ]
  },

  {
    id: '5e6021435ac9d0ecd8b94b00',
    title: 'Information Security',
    certSlug: Certification.InfoSec,
    projects: [
      {
        id: '587d824a367417b2b2512c44',
        title: 'Stock Price Checker',
        link: `${infoSecBase}/stock-price-checker`,
        certSlug: Certification.InfoSec
      },
      {
        id: '587d824a367417b2b2512c45',
        title: 'Anonymous Message Board',
        link: `${infoSecBase}/anonymous-message-board`,
        certSlug: Certification.InfoSec
      },
      {
        id: '5e46f979ac417301a38fb932',
        title: 'Port Scanner',
        link: `${infoSecBase}/port-scanner`,
        certSlug: Certification.InfoSec
      },
      {
        id: '5e46f983ac417301a38fb933',
        title: 'SHA-1 Password Cracker',
        link: `${infoSecBase}/sha-1-password-cracker`,
        certSlug: Certification.InfoSec
      },
      {
        id: '5e601c775ac9d0ecd8b94aff',
        title: 'Secure Real Time Multiplayer Game',
        link: `${infoSecBase}/secure-real-time-multiplayer-game`,
        certSlug: Certification.InfoSec
      }
    ]
  },
  {
    id: '5e46fc95ac417301a38fb935',
    title: 'Machine Learning with Python',
    certSlug: Certification.MachineLearningPy,
    projects: [
      {
        id: '5e46f8d6ac417301a38fb92d',
        title: 'Rock Paper Scissors',
        link: `${machineLearningPyBase}/rock-paper-scissors`,
        certSlug: Certification.MachineLearningPy
      },
      {
        id: '5e46f8dcac417301a38fb92e',
        title: 'Cat and Dog Image Classifier',
        link: `${machineLearningPyBase}/cat-and-dog-image-classifier`,
        certSlug: Certification.MachineLearningPy
      },
      {
        id: '5e46f8e3ac417301a38fb92f',
        title: 'Book Recommendation Engine using KNN',
        link: `${machineLearningPyBase}/book-recommendation-engine-using-knn`,
        certSlug: Certification.MachineLearningPy
      },
      {
        id: '5e46f8edac417301a38fb930',
        title: 'Linear Regression Health Costs Calculator',
        link: `${machineLearningPyBase}/linear-regression-health-costs-calculator`,
        certSlug: Certification.MachineLearningPy
      },
      {
        id: '5e46f8edac417301a38fb931',
        title: 'Neural Network SMS Text Classifier',
        link: `${machineLearningPyBase}/neural-network-sms-text-classifier`,
        certSlug: Certification.MachineLearningPy
      }
    ]
  },
  {
    id: '61531b20cc9dfa2741a5b800',
    title: 'College Algebra with Python',
    certSlug: Certification.CollegeAlgebraPy,
    projects: [
      {
        id: '63d83ff239c73468b059cd3f',
        title: 'Build a Multi-Function Calculator',
        link: getCollegeAlgebraPyPath('build-a-multi-function-calculator'),
        certSlug: Certification.CollegeAlgebraPy
      },
      {
        id: '63d83ffd39c73468b059cd40',
        title: 'Build a Graphing Calculator',
        link: getCollegeAlgebraPyPath('build-a-graphing-calculator'),
        certSlug: Certification.CollegeAlgebraPy
      },
      {
        id: '63d8401039c73468b059cd41',
        title: 'Build Three Math Games',
        link: getCollegeAlgebraPyPath('build-three-math-games'),
        certSlug: Certification.CollegeAlgebraPy
      },
      {
        id: '63d8401e39c73468b059cd42',
        title: 'Build a Financial Calculator',
        link: getCollegeAlgebraPyPath('build-a-financial-calculator'),
        certSlug: Certification.CollegeAlgebraPy
      },
      {
        id: '63d8402e39c73468b059cd43',
        title: 'Build a Data Graph Explorer',
        link: getCollegeAlgebraPyPath('build-a-data-graph-explorer'),
        certSlug: Certification.CollegeAlgebraPy
      }
    ]
  },
  // Legacy certifications
  {
    id: '561add10cb82ac38a17513be',
    title: 'Legacy Front End',
    certSlug: Certification.LegacyFrontEnd,
    projects: [
      {
        id: 'bd7158d8c242eddfaeb5bd13',
        title: 'Build a Personal Portfolio Webpage',
        link: `${legacyFrontEndResponsiveBase}/build-a-personal-portfolio-webpage`,
        certSlug: Certification.LegacyFrontEnd
      },
      {
        id: 'bd7158d8c442eddfaeb5bd13',
        title: 'Build a Random Quote Machine',
        link: `${legacyFrontEndBase}/build-a-random-quote-machine`,
        certSlug: Certification.LegacyFrontEnd
      },
      {
        id: 'bd7158d8c442eddfaeb5bd0f',
        title: 'Build a 25 + 5 Clock',
        link: `${legacyFrontEndBase}/build-a-25--5-clock`,
        certSlug: Certification.LegacyFrontEnd
      },
      {
        id: 'bd7158d8c442eddfaeb5bd17',
        title: 'Build a JavaScript Calculator',
        link: `${legacyFrontEndBase}/build-a-javascript-calculator`,
        certSlug: Certification.LegacyFrontEnd
      },
      {
        id: 'bd7158d8c442eddfaeb5bd10',
        title: 'Show the Local Weather',
        link: `${legacyFrontEndTakeHomeBase}/show-the-local-weather`,
        certSlug: Certification.LegacyFrontEnd
      },
      {
        id: 'bd7158d8c442eddfaeb5bd1f',
        title: 'Use the TwitchTV JSON API',
        link: `${legacyFrontEndTakeHomeBase}/use-the-twitch-json-api`,
        certSlug: Certification.LegacyFrontEnd
      },
      {
        id: 'bd7158d8c442eddfaeb5bd18',
        title: 'Build a Tribute Page',
        link: `${legacyFrontEndResponsiveBase}/build-a-tribute-page`,
        certSlug: Certification.LegacyFrontEnd
      },
      {
        id: 'bd7158d8c442eddfaeb5bd19',
        title: 'Build a Wikipedia Viewer',
        link: `${legacyFrontEndTakeHomeBase}/build-a-wikipedia-viewer`,
        certSlug: Certification.LegacyFrontEnd
      },
      {
        id: 'bd7158d8c442eedfaeb5bd1c',
        title: 'Build a Tic Tac Toe Game',
        link: `${legacyFrontEndTakeHomeBase}/build-a-tic-tac-toe-game`,
        certSlug: Certification.LegacyFrontEnd
      },
      {
        id: 'bd7158d8c442eddfaeb5bd1c',
        title: 'Build a Simon Game',
        link: `${legacyFrontEndTakeHomeBase}/build-a-simon-game`,
        certSlug: Certification.LegacyFrontEnd
      }
    ]
  },
  {
    id: '561abd10cb81ac38a17513bc',
    title: 'Legacy JavaScript Algorithms and Data Structures',
    certSlug: Certification.JsAlgoDataStruct,
    projects: [
      {
        id: 'aaa48de84e1ecc7c742e1124',
        title: 'Palindrome Checker',
        link: `${jsAlgoBase}/palindrome-checker`,
        certSlug: Certification.JsAlgoDataStruct
      },
      {
        id: 'a7f4d8f2483413a6ce226cac',
        title: 'Roman Numeral Converter',
        link: `${jsAlgoBase}/roman-numeral-converter`,
        certSlug: Certification.JsAlgoDataStruct
      },
      {
        id: '56533eb9ac21ba0edf2244e2',
        title: 'Caesars Cipher',
        link: `${jsAlgoBase}/caesars-cipher`,
        certSlug: Certification.JsAlgoDataStruct
      },
      {
        id: 'aff0395860f5d3034dc0bfc9',
        title: 'Telephone Number Validator',
        link: `${jsAlgoBase}/telephone-number-validator`,
        certSlug: Certification.JsAlgoDataStruct
      },
      {
        id: 'aa2e6f85cab2ab736c9a9b24',
        title: 'Cash Register',
        link: `${jsAlgoBase}/cash-register`,
        certSlug: Certification.JsAlgoDataStruct
      }
    ]
  },
  {
    id: '660add10cb82ac38a17513be',
    title: 'Legacy Back End',
    certSlug: Certification.LegacyBackEnd,
    projects: [
      {
        id: 'bd7158d8c443edefaeb5bdef',
        title: 'Timestamp Microservice',
        link: `${legacyBackEndBase}/timestamp-microservice`,
        certSlug: Certification.LegacyBackEnd
      },
      {
        id: 'bd7158d8c443edefaeb5bdff',
        title: 'Request Header Parser Microservice',
        link: `${legacyBackEndBase}/request-header-parser-microservice`,
        certSlug: Certification.LegacyBackEnd
      },
      {
        id: 'bd7158d8c443edefaeb5bd0e',
        title: 'URL Shortener Microservice',
        link: `${legacyBackEndBase}/url-shortener-microservice`,
        certSlug: Certification.LegacyBackEnd
      },
      {
        id: 'bd7158d8c443edefaeb5bdee',
        title: 'Image Search Abstraction Layer',
        link: `${legacyBackEndTakeHomeBase}/build-an-image-search-abstraction-layer`,
        certSlug: Certification.LegacyBackEnd
      },
      {
        id: 'bd7158d8c443edefaeb5bd0f',
        title: 'File Metadata Microservice',
        link: `${legacyBackEndBase}/file-metadata-microservice`,
        certSlug: Certification.LegacyBackEnd
      },
      {
        id: 'bd7158d8c443eddfaeb5bdef',
        title: 'Build a Voting App',
        link: `${legacyBackEndTakeHomeBase}/build-a-voting-app`,
        certSlug: Certification.LegacyBackEnd
      },
      {
        id: 'bd7158d8c443eddfaeb5bdff',
        title: 'Build a Nightlife Coordination App',
        link: `${legacyBackEndTakeHomeBase}/build-a-nightlife-coordination-app`,
        certSlug: Certification.LegacyBackEnd
      },
      {
        id: 'bd7158d8c443eddfaeb5bd0e',
        title: 'Chart the Stock Market',
        link: `${legacyBackEndTakeHomeBase}/chart-the-stock-market`,
        certSlug: Certification.LegacyBackEnd
      },
      {
        id: 'bd7158d8c443eddfaeb5bd0f',
        title: 'Manage a Book Trading Club',
        link: `${legacyBackEndTakeHomeBase}/manage-a-book-trading-club`,
        certSlug: Certification.LegacyBackEnd
      },
      {
        id: 'bd7158d8c443eddfaeb5bdee',
        title: 'Build a Pinterest Clone',
        link: `${legacyBackEndTakeHomeBase}/build-a-pinterest-clone`,
        certSlug: Certification.LegacyBackEnd
      }
    ]
  },

  {
    id: '561add10cb82ac39a17513bc',
    title: 'Legacy Data Visualization',
    certSlug: Certification.LegacyDataVis,
    projects: [
      {
        id: 'bd7157d8c242eddfaeb5bd13',
        title: 'Build a Markdown Previewer',
        link: `${legacyDataVisFrontEndBase}/build-a-markdown-previewer`,
        certSlug: Certification.LegacyDataVis
      },
      {
        id: 'bd7156d8c242eddfaeb5bd13',
        title: 'Build a freeCodeCamp Forum Homepage',
        link: `${legacyDataVisTakeHomeBase}/build-a-freecodecamp-forum-homepage`,
        certSlug: Certification.LegacyDataVis
      },
      {
        id: 'bd7155d8c242eddfaeb5bd13',
        title: 'Build a Recipe Box',
        link: `${legacyDataVisTakeHomeBase}/build-a-recipe-box`,
        certSlug: Certification.LegacyDataVis
      },
      {
        id: 'bd7154d8c242eddfaeb5bd13',
        title: 'Build the Game of Life',
        link: `${legacyDataVisTakeHomeBase}/build-the-game-of-life`,
        certSlug: Certification.LegacyDataVis
      },
      {
        id: 'bd7153d8c242eddfaeb5bd13',
        title: 'Build a Roguelike Dungeon Crawler Game',
        link: `${legacyDataVisTakeHomeBase}/build-a-roguelike-dungeon-crawler-game`,
        certSlug: Certification.LegacyDataVis
      },
      {
        id: 'bd7168d8c242eddfaeb5bd13',
        title: 'Visualize Data with a Bar Chart',
        link: `${legacyDataVisBase}/visualize-data-with-a-bar-chart`,
        certSlug: Certification.LegacyDataVis
      },
      {
        id: 'bd7178d8c242eddfaeb5bd13',
        title: 'Visualize Data with a Scatterplot Graph',
        link: `${legacyDataVisBase}/visualize-data-with-a-scatterplot-graph`,
        certSlug: Certification.LegacyDataVis
      },
      {
        id: 'bd7188d8c242eddfaeb5bd13',
        title: 'Visualize Data with a Heat Map',
        link: `${legacyDataVisBase}/visualize-data-with-a-heat-map`,
        certSlug: Certification.LegacyDataVis
      },
      {
        id: 'bd7198d8c242eddfaeb5bd13',
        title: 'Show National Contiguity with a Force Directed Graph',
        link: `${legacyDataVisTakeHomeBase}/show-national-contiguity-with-a-force-directed-graph`,
        certSlug: Certification.LegacyDataVis
      },
      {
        id: 'bd7108d8c242eddfaeb5bd13',
        title: 'Map Data Across the Globe',
        link: `${legacyDataVisTakeHomeBase}/map-data-across-the-globe`,
        certSlug: Certification.LegacyDataVis
      }
    ]
  },
  {
    id: '561add10cb82ac38a17213bc',
    title: 'Legacy Information Security and Quality Assurance',
    // Keep this as information-security-and-quality-assurance
    certSlug: Certification.LegacyInfoSecQa,
    projects: [
      // Keep this as information-security-and-quality-assurance
      {
        id: '587d8249367417b2b2512c41',
        title: 'Metric-Imperial Converter',
        link: `${legacyInfosecQaQaBase}/metric-imperial-converter`,
        certSlug: Certification.LegacyInfoSecQa
      },
      {
        id: '587d8249367417b2b2512c42',
        title: 'Issue Tracker',
        link: `${legacyInfosecQaQaBase}/issue-tracker`,
        certSlug: Certification.LegacyInfoSecQa
      },
      {
        id: '587d824a367417b2b2512c43',
        title: 'Personal Library',
        link: `${legacyInfosecQaQaBase}/personal-library`,
        certSlug: Certification.LegacyInfoSecQa
      },
      {
        id: '587d824a367417b2b2512c44',
        title: 'Stock Price Checker',
        link: `${legacyInfosecQaInfosecBase}/stock-price-checker`,
        certSlug: Certification.LegacyInfoSecQa
      },
      {
        id: '587d824a367417b2b2512c45',
        title: 'Anonymous Message Board',
        link: `${legacyInfosecQaInfosecBase}/anonymous-message-board`,
        certSlug: Certification.LegacyInfoSecQa
      }
    ]
  },
  {
    id: '647e3159823e0ef219c7359b',
    title: 'Foundational C# with Microsoft',
    certSlug: Certification.FoundationalCSharp,
    projects: [
      {
        id: '647e22d18acb466c97ccbef8',
        title: 'Foundational C# with Microsoft Certification Exam',
        link: `${foundationalCSharpBase}/foundational-c-sharp-with-microsoft-certification-exam`,
        certSlug: Certification.FoundationalCSharp
      }
    ]
  },
  // Upcoming Certifications
  {
    id: '64514fda6c245de4d11eb7bb',
    title: 'Certified Full Stack Developer',
    certSlug: Certification.FullStackDeveloper,
    projects: [
      {
        id: '645147516c245de4d11eb7ba',
        title: 'Certified Full Stack Developer Exam',
        link: `${fullStackDeveloperBase}/exam-certified-full-stack-developer/exam-certified-full-stack-developer`,
        certSlug: Certification.FullStackDeveloper
      }
    ]
  },
  {
    id: '651dd7e01d697d0aab7833b7',
    title: 'A2 English for Developers',
    certSlug: Certification.A2English,
    projects: [
      {
        id: '651dd3e06ffb500e3f2ce478',
        title: 'A2 English for Developers Certification Exam',
        link: `${a2EnglishBase}/a2-english-for-developers-certification-exam/a2-english-for-developers-certification-exam`,
        certSlug: Certification.A2English
      }
    ]
  },
  {
    id: '66607e53317411dd5e8aae21',
    title: 'B1 English for Developers',
    certSlug: Certification.B1English,
    projects: [
      {
        id: '66607e5b317411dd5e8aae22',
        title: "Dialogue 1: I'm Tom",
        link: `${b1EnglishBase}/learn-how-to-describe-places-and-events/dialogue-1-im-tom`,
        certSlug: Certification.B1English
      }
    ]
  }
] as const;

function getResponsiveWebDesignPath(project: string) {
  return `${responsiveWeb22Base}/${project}-project/${project}`;
}

function getCollegeAlgebraPyPath(project: string) {
  return `${collegeAlgebraPyBase}/${project}-project/${project}`;
}

function getJavaScriptAlgoPath(project: string) {
  return `${jsAlgo22Base}/${project}-project/${project}`;
}

type FilteredCert<T, U> = T extends { certSlug: U } ? T : never;

type CurrentCert = FilteredCert<
  (typeof allStandardCerts)[number],
  (typeof currentCertifications)[number]
>;

type LegacyCert = FilteredCert<
  (typeof allStandardCerts)[number],
  (typeof legacyCertifications)[number]
>;

type UpcomingCert = FilteredCert<
  (typeof allStandardCerts)[number],
  (typeof upcomingCertifications)[number]
>;

const currentCerts = allStandardCerts.filter((cert): cert is CurrentCert =>
  currentCertifications.includes(cert.certSlug)
);
const legacyCerts = allStandardCerts.filter((cert): cert is LegacyCert =>
  legacyCertifications.includes(cert.certSlug)
);
const upcomingCerts = allStandardCerts.filter((cert): cert is UpcomingCert =>
  upcomingCertifications.includes(cert.certSlug)
);
const liveCerts = showUpcomingChanges
  ? [...currentCerts, ...legacyCerts, fullstackCert, ...upcomingCerts]
  : [...currentCerts, ...legacyCerts, fullstackCert];

type CertsToProjects = Record<
  (typeof allStandardCerts)[number]['certSlug'],
  (typeof allStandardCerts)[number]['projects']
>;

const certsToProjects = allStandardCerts.reduce((acc, curr) => {
  return {
    ...acc,
    [curr.certSlug]: curr.projects
  };
}, {} as CertsToProjects);

export type CertTitle =
  | (typeof liveCerts)[number]['title']
  | 'Legacy Full Stack';

export { liveCerts, certsToProjects };
