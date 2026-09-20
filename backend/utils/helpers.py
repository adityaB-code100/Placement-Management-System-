from bson import ObjectId
from datetime import datetime

def format_doc(doc):
    """Recursively converts BSON ObjectId and datetime in dicts to JSON serializable strings."""
    if doc is None:
        return None
    if isinstance(doc, list):
        return [format_doc(item) for item in doc]
    if isinstance(doc, dict):
        new_doc = {}
        for k, v in doc.items():
            if k == '_id':
                new_doc['id'] = str(v)
            elif isinstance(v, ObjectId):
                new_doc[k] = str(v)
            elif isinstance(v, datetime):
                new_doc[k] = v.isoformat()
            elif isinstance(v, (dict, list)):
                new_doc[k] = format_doc(v)
            else:
                new_doc[k] = v
        return new_doc
    return doc

def parse_object_id(id_str):
    try:
        return ObjectId(id_str)
    except Exception:
        return None
