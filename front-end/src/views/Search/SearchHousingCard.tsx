import React from "react";
import styles from "./Search.module.css";
import { Card } from "react-bootstrap";

/* displays card for a city result
in the search page */
function SearchHousingCard(props:any) {

    /* attributes of a city */
    const housing_attributes = [
        {
            name: "Name:",
            attribute: "property_name",
        },
        {
            name: "Address:",
            attribute: "address",
        },
    ]

    /* map the attribute data to text in the card */
    const displayCardText = () => {
        return (
        housing_attributes.map((housing, index) => (
            <Card.Text className="card-text-style" 
                        key={index}>
                <b>{housing.name} {" "}</b>
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
