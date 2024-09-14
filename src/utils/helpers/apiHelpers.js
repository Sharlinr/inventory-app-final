export function lowerCaseCompare(a = "",b = "") {
    return a.toLowerCase().includes(b.toLowerCase())
}


export async function validateJSONData(req) {
    let body
    try {
        body = await req.json() // Parse incoming data to json
        return [false, body]
    }catch (error) {
        return [true,null]
    }
}

export function validateItemData(data) {
    const errors = [];
    
    // Validate name
    if (!data.name || data.name.trim() === "") {
      errors.push("Name is required");
    }
    
    // Validate description
    if (!data.description || data.description.trim() === "") {
      errors.push("Description required");
    }
    
    // Validate quantity
    if (!data.quantity || isNaN(data.quantity) || data.quantity <= 0) {
      errors.push("Valid quantity is required");
    }
    
    // Validate category
    if (!data.category || data.category.trim() === "") {
      errors.push("Category required");
    }
    
    const hasErrors = errors.length > 0;
    return [errors.length > 0, errors];
  }
