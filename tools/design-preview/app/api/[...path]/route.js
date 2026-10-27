function unavailable(){return Response.json({ok:false,error:"Local visual review: providers are not connected."},{status:503});}
export const GET=unavailable;
export const POST=unavailable;
