import {GranitShowMoreButtonStyle} from './GranitShowMoreButton.Style';
import ShowMore from "@/icons/ShowMore";

const GranitShowMoreButton = () => {
     return (
          <GranitShowMoreButtonStyle>
               <ShowMore></ShowMore>
               Показать еще ({})
          </GranitShowMoreButtonStyle>
     )
}

export default GranitShowMoreButton