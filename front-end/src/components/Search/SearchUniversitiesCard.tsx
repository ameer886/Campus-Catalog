import React from "react";
import "./Search.css";
import { Card } from "react-bootstrap";
import { Highlight } from "react-instantsearch-dom"

/* displays card for a city result
in the search page */
function SearchCityCard(props:any) {

    /* attributes of a city */
    const city_attributes = [
        {
            name: "Name:",
            attribute: "univ_name",
            attribute_id: 0
        },
        {
            name: "Number of Undergrad Students:",
            attribute: "num_undergrad",
            attribute_id: 1
        },
        {
            name: "School URL:",
            attribute: "school_url",
            attribute_id: 2
        },
        {
            name: "Locale:",
            attribute: "locale",
            attribute_id: 3
        },
        {
            name: "Acceptance Rate:",
            attribute: "acceptance_rate",
            attribute_id: 4
        },
        {
            name: "Average SAT:",
            attribute: "avg_sat",
            attribute_id: 5
        },
    ]

    /* map the attribute data to text in the card */
    const displayCardText = () => {
        return (
        city_attributes.map((city) => (
            <Card.Text className="card-text-style" 
                        key={city.attribute_id}>
                <b>{city.name} {" "}</b>
                <Highlight attribute={city.attribute} 
                            tagName="mark" 
                            hit={props.hit} />
            </Card.Text>
        ))
        );
    }

    return(
        <Card>
            <Card.Body>
                <a href={"/cities/id=" + props.hit.city_id}>
                    <u>
                        <Card.Title className="card-title-style">
                            {props.hit.city_name}
                        </Card.Title>
                    </u>
                </a>
                {displayCardText()}
            </Card.Body>
        </Card> 
    );
}
export default SearchCityCard;
