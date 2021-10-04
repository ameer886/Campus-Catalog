// Tool images
import AWSLogoImg from './Images/AWSLogo.png';
import DiscordLogoImg from './Images/DiscordLogo.png';
import GitLabLogoImg from './Images/GitLabLogo.png';
import NamecheapLogoImg from './Images/NamecheapLogo.png';
import NodeJsLogoImg from './Images/NodeJSLogo.png';
import NPMLogoImg from './Images/NPMLogo.png';
import PostmanLogoImg from './Images/PostmanLogo.png';
import ReactBootstrapLogoImg from './Images/ReactBootstrapLogo.png';
import ReactLogoImg from './Images/ReactLogo.png';
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
    link: 'https://react-bootstrap.github.io/',
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
    name: 'Google Maps',
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
