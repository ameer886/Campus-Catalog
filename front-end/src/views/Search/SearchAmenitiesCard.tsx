import React from "react";
import styles from "./Search.module.css";
import { Card } from "react-bootstrap";

/* displays card for a city result
in the search page */
function SearchAmenitiesCard(props:any) {

    /* attributes of a city */
    const amenities_attributes = [
        {
            name: "Name:",
            attribute: "amen_name",
        },
        {
            name: "City:",
            attribute: "city",
        },
        {
            name: "Zip Code:",
            attribute: "zip_code",
        },
        {
            name: "State:",
            attribute: "state",
        },
    ]

    /* map the attribute data to text in the card */
    const displayCardText = () => {
        return (
        amenities_attributes.map((amenity, index) => (
            <Card.Text className="card-text-style" 
                        key={index}>
                <b>{amenity.name} {" "}</b>
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
