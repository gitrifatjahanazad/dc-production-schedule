import xmltodict

def xml_to_json(xml_string):
    # Parse the XML string to a Python dictionary
    xml_dict = xmltodict.parse(xml_string)
    return xml_dict