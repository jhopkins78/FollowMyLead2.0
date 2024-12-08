FROM amazonlinux:2

# Install Python 3.9 and development tools
RUN yum update -y && \
    yum groupinstall -y "Development Tools" && \
    yum install -y \
    python39 \
    python39-devel \
    postgresql-devel \
    zip

WORKDIR /var/task

COPY requirements.txt .

# Install Python packages
RUN python3.9 -m pip install --upgrade pip && \
    python3.9 -m pip install --target /var/task -r requirements.txt

COPY . .

ENV DATABASE_URL="postgresql://your_username:your_password@your_host:5432/your_database"
ENV JWT_SECRET_KEY="your_secret_key"
ENV LOG_LEVEL="DEBUG"

# Create deployment package
RUN zip -r /var/task/function.zip .
