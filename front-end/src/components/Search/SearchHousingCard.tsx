import React from "react";
import "./Search.css";
import { Card } from "react-bootstrap";
import { Highlight } from "react-instantsearch-dom"

/* displays card for a city result
in the search page */
function SearchHousingCard(props:any) {

    /* attributes of a city */
    const housing_attributes = [
        {
            name: "Name:",
            attribute: "property_name",
            attribute_id: 0
        },
        {
            name: "Address:",
            attribute: "address",
            attribute_id: 1
        },
    ]

    /* map the attribute data to text in the card */
    const displayCardText = () => {
        return (
        housing_attributes.map((housing) => (
            <Card.Text className="card-text-style" 
                        key={housing.attribute_id}>
                <b>{housing.name} {" "}</b>
                <Highlight attribute={housing.attribute} 
                            tagName="mark" 
                            hit={props.hit} />
            </Card.Text>
        ))
        );
    }

    return(
        <Card>
            <Card.Body>
                <a href={"/housing/id=" + props.hit.property_id}>
                    <u>
                        <Card.Title className="card-title-style">
                            {props.hit.property_name}
                        </Card.Title>
                    </u>
                </a>
                {displayCardText()}
            </Card.Body>
        </Card> 
    );
}
export default SearchHousingCard;
