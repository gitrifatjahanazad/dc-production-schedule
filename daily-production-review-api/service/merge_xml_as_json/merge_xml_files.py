import xml.etree.ElementTree as ET

def merge_xml_files(root1, root2, merge_based_on):

    # Extract relevant data from each response
    if "productionno" in merge_based_on:
        data1 = {elem.attrib[merge_based_on]: elem.attrib for elem in root1.findall(".//*[@productionno]")}
        data2 = {elem.attrib[merge_based_on]: elem.attrib for elem in root2.findall(".//*[@productionno]")}

    elif "jobid" in merge_based_on:
        data1 = {elem.attrib[merge_based_on]: elem.attrib for elem in root1.findall(".//*[@jobid]")}
        data2 = {elem.attrib[merge_based_on]: elem.attrib for elem in root2.findall(".//*[@jobid]")}

    # Merge the data based on the "productionno" attribute
    merged_data = {key: {**data1.get(key, {}), **data2.get(key, {})} for key in set(data1) | set(data2)}

    # Create the merged XML response
    if "productionno" in merge_based_on:
        merged_root = ET.Element("MergedOptionsVariations")
        for productionno, attributes in merged_data.items():
            schedule_elem = ET.SubElement(merged_root, "OptionsVariations")
            schedule_elem.set(merge_based_on, productionno)
            for key, value in attributes.items():
                schedule_elem.set(key, value)

    elif "jobid" in merge_based_on:
        merged_root = ET.Element("MergedResponse")
        for productionno, attributes in merged_data.items():
            schedule_elem = ET.SubElement(merged_root, "ScheduleOptionsVariations")
            schedule_elem.set(merge_based_on, productionno)
            for key, value in attributes.items():
                schedule_elem.set(key, value)
        merged_response_to_string = ET.tostring(merged_root, encoding="utf-8").decode("utf-8")

        # output_file_path = f"output.xml"
        # Write the merged response to a new XML file
        # with open(output_file_path, 'w') as output_file:
        #     output_file.write(merged_response_to_string)
        return merged_response_to_string


    merged_response = ET.ElementTree(merged_root)

    return merged_response
