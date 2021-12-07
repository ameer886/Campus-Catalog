// Tool images
import AmazonRDSLogoImg from './Images/AmazonRDSLogo.png';
import AWSElasticBeanstalkLogoImg from './Images/AWSElasticBeanstalkLogo.png';
import AWSLogoImg from './Images/AWSLogo.png';
import AxiosLogoImg from './Images/AxiosLogo.png';
import D3LogoImg from './Images/D3Logo.png';
import DiscordLogoImg from './Images/DiscordLogo.png';
import DockerLogoImg from './Images/DockerLogo.png';
import FlaskLogoImg from './Images/FlaskLogo.png';
import GitLabLogoImg from './Images/GitLabLogo.png';
import JestLogoImg from './Images/JestLogo.png';
import MarshmallowLogoImg from './Images/MarshmallowLogo.png';
import NamecheapLogoImg from './Images/NamecheapLogo.png';
import NodeJsLogoImg from './Images/NodeJSLogo.png';
import NGINXLogoImg from './Images/NGINXLogo.png';
import NPMLogoImg from './Images/NPMLogo.png';
import PostmanLogoImg from './Images/PostmanLogo.png';
import PythonLogoImg from './Images/PythonLogo.png';
import ReactBootstrapLogoImg from './Images/ReactBootstrapLogo.png';
import ReactLogoImg from './Images/ReactLogo.png';
import RechartsLogoImg from './Images/RechartsLogo.png';
import SeleniumLogoImg from './Images/SeleniumLogo.png';
import SQLAlchemyLogoImg from './Images/SQLAlchemyLogo.png';
import TypeScriptLogoImg from './Images/TypeScriptLogo.png';

// API images
import ApifyLogoImg from './Images/ApifyLogo.png';
import DoELogoImg from './Images/DoELogo.png';
import GoogleMapsLogoImg from './Images/GoogleMapsLogo.png';
import YelpLogoImg from './Images/YelpLogo.png';

export type ToolOrAPI = {
  name: string;
  description: string;
  link: string;
  img: string;
};

export const aboutTools: ToolOrAPI[] = [
  {
    name: 'GitLab',
    description: 'Source control',
    link: 'https://gitlab.com/',
    img: GitLabLogoImg,
  },
  {
    name: 'Postman',
    description: 'API Management',
    link: 'https://www.postman.com/',
    img: PostmanLogoImg,
  },
  {
    name: 'React',
    description: 'Front-end Framework',
    link: 'https://reactjs.org/',
    img: ReactLogoImg,
  },
  {
    name: 'React Bootstrap',
    description: 'CSS Styling Framework',
    link: 'https://react-bootstrap.github.io/',
    img: ReactBootstrapLogoImg,
  },
  {
    name: 'TypeScript',
    description: 'JavaScript Typing',
    link: 'https://www.typescriptlang.org/',
    img: TypeScriptLogoImg,
  },
  {
    name: 'Namecheap',
    description: 'Procure Site Domain',
    link: 'https://www.namecheap.com/',
    img: NamecheapLogoImg,
  },
  {
    name: 'Discord',
    description: 'Team Communication',
    link: 'https://discord.com/',
    img: DiscordLogoImg,
  },
  {
    name: 'AWS',
    description: 'Website Hosting',
    link: 'https://aws.amazon.com/',
    img: AWSLogoImg,
  },
  {
    name: 'NodeJS',
    description: 'JS Runtime',
    link: 'https://nodejs.org/en/',
    img: NodeJsLogoImg,
  },
  {
    name: 'NPM',
    description: 'Node Package Manager',
    link: 'https://www.npmjs.com/',
    img: NPMLogoImg,
  },
  {
    name: 'Jest',
    description: 'React unit testing',
    link: 'https://jestjs.io/',
    img: JestLogoImg,
  },
  {
    name: 'Axios',
    description: 'RESTful API manager',
    link: 'https://axios-http.com/',
    img: AxiosLogoImg,
  },
  {
    name: 'Selenium',
    description: 'Acceptance tests',
    link: 'https://www.selenium.dev/',
    img: SeleniumLogoImg,
  },
  {
    name: 'Python',
    description: 'Back-end implementation',
    link: 'https://www.python.org/',
    img: PythonLogoImg,
  },
  {
    name: 'NGINX',
    description: 'Server hosting',
    link: 'https://www.nginx.com/',
    img: NGINXLogoImg,
  },
  {
    name: 'AWS Elastic Beanstalk',
    description: 'Back-end server deployment',
    link: 'https://aws.amazon.com/elasticbeanstalk/',
    img: AWSElasticBeanstalkLogoImg,
  },
  {
    name: 'Docker',
    description: 'Containerizations',
    link: 'https://www.docker.com/',
    img: DockerLogoImg,
  },
  {
    name: 'Amazon RDS',
    description: 'RDBMS',
    link: 'https://aws.amazon.com/rds/',
    img: AmazonRDSLogoImg,
  },
  {
    name: 'marshmallow',
    description: 'Object serialization',
    link: 'https://marshmallow.readthedocs.io/en/stable/',
    img: MarshmallowLogoImg,
  },
  {
    name: 'Flask',
    description: 'Python web dev framework',
    link: 'https://flask.palletsprojects.com/en/1.1.x/',
    img: FlaskLogoImg,
  },
  {
    name: 'SQLAlchemy',
    description: 'Python SQL toolkit',
    link: 'https://www.sqlalchemy.org/',
    img: SQLAlchemyLogoImg,
  },
  {
    name: 'D3',
    description: 'Visualization Tool',
    link: 'https://d3js.org/',
    img: D3LogoImg,
  },
  {
    name: 'Recharts',
    description: 'D3 Simplifier',
    link: 'https://recharts.org/en-US/',
    img: RechartsLogoImg,
  },
];

export const aboutAPIs: ToolOrAPI[] = [
  {
    name: 'YelpFusion',
    description: 'Used to get entertainment ratings',
    link: 'https://www.yelp.com/developers/documentation/v3',
    img: YelpLogoImg,
  },
  {
    name: 'Department of Education',
    description: 'Used to get university data',
    link: 'https://collegescorecard.ed.gov/data/documentation/',
    img: DoELogoImg,
  },
  {
    name: 'Apartments.com',
    description: 'Used to get apartment data',
    link: 'https://apify.com/tugkan/apartments-scraper#apartments-scraper',
    img: ApifyLogoImg,
  },
  {
    name: 'Google Maps: Places For Reviews',
    description: 'Used to find reviews',
    link: 'https://developers.google.com/maps/documentation/places/web-service/overview',
    img: GoogleMapsLogoImg,
  },
  {
    name: 'GitLab',
    description: 'Used to get repo info',
    link: 'https://docs.gitlab.com/ee/api/api_resources.html',
    img: GitLabLogoImg,
  },
  {
    name: 'Google Maps: Embed',
    description: 'Used to embed maps',
    link: 'https://developers.google.com/maps/documentation/embed/get-started?hl=en_US',
    img: GoogleMapsLogoImg,
  },
];
