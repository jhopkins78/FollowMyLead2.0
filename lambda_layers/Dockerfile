FROM amazonlinux:2

# Install Python 3.9 and development tools
RUN yum update -y && \
    yum groupinstall -y "Development Tools" && \
    yum install -y \
    python39 \
    python39-devel \
    postgresql-devel

WORKDIR /layer

# Install psycopg2
RUN python3.9 -m pip install --upgrade pip && \
    python3.9 -m pip install psycopg2-binary==2.9.9 -t python/lib/python3.9/site-packages/

# Create layer archive
RUN zip -r layer.zip python/
