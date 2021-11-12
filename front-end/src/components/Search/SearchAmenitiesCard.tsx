import React from "react";
import "./Search.css";
import { Card } from "react-bootstrap";
import { Highlight } from "react-instantsearch-dom"

/* displays card for a city result
in the search page */
function SearchAmenitiesCard(props:any) {

    /* attributes of a city */
    const amenities_attributes = [
        {
            name: "Name:",
            attribute: "amen_name",
            attribute_id: 0
        },
        {
            name: "City:",
            attribute: "city",
            attribute_id: 2
        },
        {
            name: "Zip Code:",
            attribute: "zip_code",
            attribute_id: 3
        },
        {
            name: "State:",
            attribute: "state",
            attribute_id: 5
        },
    ]

    /* map the attribute data to text in the card */
    const displayCardText = () => {
        return (
        amenities_attributes.map((amenity) => (
            <Card.Text className="card-text-style" 
                        key={amenity.attribute_id}>
                <b>{amenity.name} {" "}</b>
                <Highlight attribute={amenity.attribute} 
                            tagName="mark" 
                            hit={props.hit} />
            </Card.Text>
        ))
        );
    }

    return(
        <Card>
            <Card.Body>
                <a href={"/amenities" + props.hit.amen_id}>
                    <u>
                        <Card.Title className="card-title-style">
                            {props.hit.amen_name}
                        </Card.Title>
                    </u>
                </a>
                {displayCardText()}
            </Card.Body>
        </Card> 
    );
}
export default SearchAmenitiesCard;
