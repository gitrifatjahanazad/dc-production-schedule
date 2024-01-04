def replace_attribute(root, old_attribute, new_attribute):

    # Find and replace all occurrences of the old attribute with the new attribute
    for elem in root.iter():
        for key, value in list(elem.attrib.items()):
            if key == old_attribute:
                elem.attrib[new_attribute] = value
                del elem.attrib[key]

    # Convert the modified XML back to a string
    return root