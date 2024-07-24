from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import mysql.connector 
from sqlalchemy.exc import StatementError

app = Flask(__name__)


# Configure the database connection
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+mysqlconnector://root:akshaya100@host.docker.internal:3306/tasks_db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize CORS with default settings
CORS(app)

db = SQLAlchemy(app)

# Define the Task model
class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)
    priority = db.Column(db.Enum('Low', 'Medium', 'High'))
    daysRemaining = db.Column(db.Integer)
    isNew = db.Column(db.Boolean, default=True)  # Added isNew column

    def to_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}

@app.route('/api/v1/tasks', methods=['GET'])
def get_tasks():
    tasks = Task.query.all()
    return jsonify([{
        'id': task.id,
        'name': task.name,
        'description': task.description,
        'priority': task.priority,
        'daysRemaining': task.daysRemaining,
        'isNew': task.isNew  # Include isNew in the response
    } for task in tasks])

@app.route('/api/v1/tasks', methods=['POST'])
def add_task():
    try:
        data = request.get_json()
        
        # Ensure priority is a valid value or provide a default
        priority = data.get('priority', 'Low')  # Default to 'Low' if not provided
        
        # Validate priority value
        if priority not in ['Low', 'Medium', 'High']:
            return jsonify({'error': 'Invalid priority value'}), 400

        # Create the new task
        new_task = Task(
            id=data['id'],
            name=data['name'],
            description=data.get('description'),
            priority=priority,
            daysRemaining=data['daysRemaining'],
            isNew=data.get('isNew', True)
        )

        db.session.add(new_task)
        db.session.commit()

        return jsonify(new_task.to_dict()), 201
    except (TypeError, ValueError, mysql.connector.DataError) as e:
        return jsonify({'error': f'Invalid data type: {str(e)}'}), 400
    except (mysql.connector.InterfaceError, mysql.connector.OperationalError) as e:
        return jsonify({'error': f'Database connection error: {str(e)}'}), 500
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/v1/tasks/<int:task_id>', methods=['PUT'])
def update_task(task_id):
    try:
        data = request.get_json()
        # returns a 404 error request if task_id is not found in the database
        task = Task.query.get_or_404(task_id)
        
        # Update task fields
        task.name = data['name']
        task.description = data.get('description')
        task.priority = data['priority']
        task.daysRemaining = data['daysRemaining']
        task.isNew = data.get('isNew', task.isNew)  

        db.session.commit()
        return jsonify(task.to_dict())
    except (TypeError, ValueError, StatementError) as e:
        return jsonify({'error': f'Invalid data type: {str(e)}'}), 400
    except mysql.connector.errors.DatabaseError as e:
        if "Incorrect integer value" in str(e):
            return jsonify({'error': f'Invalid data type: {str(e)}'}), 400
        else:
            return jsonify({'error': str(e)}), 500
    except (mysql.connector.InterfaceError, mysql.connector.OperationalError) as e:
        return jsonify({'error': f'Database connection error: {str(e)}'}), 500
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/v1/tasks/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    task = Task.query.get_or_404(task_id)
    db.session.delete(task)
    db.session.commit()
    return '', 204

#debug mode ensures auto reloading
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)