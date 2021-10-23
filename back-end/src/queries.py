def query_images(id):
    return f'''
    SELECT * FROM "housing" house
    LEFT JOIN (
        SELECT property_id AS image_id, STRING_AGG(image_url, \'@@@\') AS images 
        FROM "housingImages"
        GROUP BY property_id) AS image
    ON house.property_id = image.image_id
    WHERE house.property_id = '{id}'
    '''

def query_amen(id):
    return f'''
    WITH cte AS (
        SELECT property_id, property_name, amenity.amen_id, amenity.amen_name FROM "housing" house
        LEFT JOIN(
            SELECT amen_id, amen_name, city, state, categories
            FROM "amenities" a
            LEFT JOIN (
                SELECT amen_id AS amenity, STRING_AGG(category, '@@@') AS categories
                FROM "amenitiesCategories"
                GROUP BY amen_id
            ) AS c
            ON a.amen_id = c.amenity
        ) AS amenity
        ON house.city = amenity.city AND house.state = amenity.state
    )
    SELECT Distinct(amen_id), amen_name
    FROM cte
    WHERE cte.property_id = '{id}'
    '''

def query_univ(id):
    return f'''
    WITH cte AS (
        SELECT property_id, property_name, univ.univ_id, univ.univ_name FROM \"housing\" house
        LEFT JOIN(
            SELECT univ_id, univ_name, city, state
            FROM \"university\" u
            GROUP BY univ_id, city, state
        ) AS univ
        ON univ.city = house.city AND univ.state = house.state
    )
    SELECT univ_id, univ_name
    FROM cte
    WHERE cte.property_id = '{id}'
    '''


def query_univ_from_amen(id):
    return f'''
    WITH cte AS (
        SELECT amen_id, amen_name, univ.univ_id, univ.univ_name FROM \"amenities\" amenity
        LEFT JOIN(
            SELECT univ_id, univ_name, city, state
            FROM \"university\" u
            GROUP BY univ_id, city, state
        ) AS univ
        ON univ.city = amenity.city AND univ.state = amenity.state
    )
    SELECT univ_id, univ_name
    FROM cte
    WHERE cte.amen_id = '{id}'
    '''


def query_housing_from_amen(id):
    return f'''
    WITH cte AS (
        SELECT amen_id, amen_name, house.property_id, house.property_name FROM amenities amenity
        LEFT JOIN(
            SELECT property_id, property_name, city, state
            FROM housing h
            GROUP BY property_id, city, property_name, state
        ) AS house
        ON house.city = amenity.city AND house.state = amenity.state
    )
    SELECT property_id, property_name
    FROM cte
    WHERE cte.amen_id = '{id}'
    '''

def query_univ_images(id):
    return f'''
    SELECT * FROM "university" univ
    LEFT JOIN (
        SELECT univ_id AS image_id, url AS image
        FROM "universityImages"
        GROUP BY univ_id, url) AS image
    ON univ.univ_id = image.image_id
    WHERE univ.univ_id = '{id}'
    '''    

def query_univ_amen(id):
    return f'''
    WITH cte AS (
        SELECT univ_id, univ_name, amenity.amen_id, amenity.amen_name FROM "university" univ
        LEFT JOIN(
            SELECT amen_id, amen_name, city, state, categories
            FROM "amenities" a
            LEFT JOIN (
                SELECT amen_id AS amenity, STRING_AGG(category, '@@@') AS categories
                FROM "amenitiesCategories"
                GROUP BY amen_id
            ) AS c
            ON a.amen_id = c.amenity
        ) AS amenity
        ON univ.city = amenity.city AND univ.state = amenity.state
    )
    SELECT Distinct(amen_id), amen_name
    FROM cte
    WHERE cte.univ_id = '{id}'
    '''
def query_univ_housing(id):
    return f'''
    WITH cte AS (
        SELECT univ_id, univ_name, house.property_id, house.property_name FROM "university" univ
        LEFT JOIN(
            SELECT property_id, property_name, city, state
            FROM "housing" h
            GROUP BY property_id, city, state, property_name
        ) AS house
        ON house.city = univ.city AND house.state = univ.state
    )
    SELECT property_id, property_name
    FROM cte
    WHERE cte.univ_id = '{id}'
    '''
