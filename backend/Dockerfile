# Docker image of Python runtime 
FROM python:3.9-slim

# Setting the working directory in the container
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . /app

# Install the dependencies in requirements.txt into the container
RUN pip install --no-cache-dir -r requirements.txt

# Enable public access for port 5001 
EXPOSE 5001

# Define environment variable
ENV FLASK_APP=app.py
ENV FLASK_ENV=development 

# Run flask run when the container launches
CMD ["flask", "run", "--host=0.0.0.0", "--port=5001"]

