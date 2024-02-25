class ExperimentInfo():
    """ Struct to store experiment info """
    
    def __init__(self, user_id: str, project_id: str, experiment_id: str):
        self.user_id = user_id
        self.project_id = project_id
        self.experiment_id = experiment_id
        
    def __str__(self):
        return f"user: {self.user_id}, project: {self.project_id}, experiment: {self.experiment_id}"