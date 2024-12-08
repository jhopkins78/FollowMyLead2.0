FROM --platform=linux/amd64 public.ecr.aws/lambda/python:3.9

# Install zip
RUN yum install -y zip

# Install psycopg2-binary
RUN pip install psycopg2-binary -t /opt/python/lib/python3.9/site-packages/

# Create the layer content
RUN cd /opt && zip -r /psycopg2-layer.zip python/

CMD ["bash"]
