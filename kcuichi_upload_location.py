import boto3
import json
import os

filepath = os.path.expanduser("~/Library/Caches/com.apple.findmy.fmipcore/Items.data")
print("Attempting to open the following file:")
print(filepath)

data = json.load(open(filepath, "r"))

info = {
	"timestamp": str(data[0]["location"]["timeStamp"]),
	"locality": str(data[0]["address"]["locality"]),
	"longitude": str(data[0]["location"]["longitude"]),
	"latitude": str(data[0]["location"]["latitude"])
}

print(info)

session = boto3.Session(
	aws_access_key_id="AKIAT4SDJIRVZKDR4EX7",
	aws_secret_access_key="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"
)

db = session.resource("dynamodb", region_name="eu-west-2")
table = db.Table("kcuichi")

r1 = table.put_item(Item=info)

print("Upload Complete!")
