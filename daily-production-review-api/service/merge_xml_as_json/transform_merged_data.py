def transform_data(existing_data):
    transformed_data = []
    for entry in existing_data:
        transformed_entry = {
            "JobID": entry.get("@jobid", ""),
            "JobContactLastName": entry.get("@JobContactLastName", ""),
            "Model": entry.get("@Model", ""),
            "Serial": entry.get("@Serial", ""),
            "Dealer": entry.get("@Dealer", ""),
            "Status": entry.get("@Status", ""),
            "PreferredCompletion": entry.get("@PreferredCompletion", ""),
            "Upper_x0020_cabinet": entry.get("@Upper_x0020_cabinet", ""),
            "Lower_x0020_cabinet": entry.get("@Lower_x0020_cabinet", ""),
            "Benchtops": entry.get("@Benchtops", ""),
            "Splash_x0020_Back": entry.get("@Splash_x0020_Back", ""),
            "Exterior": entry.get("@Exterior", ""),
            "Decal": entry.get("@Decal", ""),
            "Prot_x0020_Decal": entry.get("@Prot_x0020_Decal", ""),
            "Flooring": entry.get("@Flooring", ""),
            "productionno": entry.get("@productionno", ""),
            "Description": entry.get("@Description", ""),
            "Request": entry.get("@Request", ""),
            "Response": entry.get("@Response", ""),
        }
        transformed_data.append(transformed_entry)
    return transformed_data
