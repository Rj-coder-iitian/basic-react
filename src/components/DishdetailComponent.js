import React, {Component} from "react";
import {Card,CardImg,CardText,CardTitle,CardBody,Breadcrumb,BreadcrumbItem, Modal,ModalBody,ModalHeader,Button,Row,Col,Label} from "reactstrap";
import { Link } from 'react-router-dom';
import { Loading } from './LoadingComponent';
import {Control,LocalForm,Errors} from 'react-redux-form';
import { baseUrl } from '../shared/baseUrl';
import { FadeTransform, Fade, Stagger } from 'react-animation-components';

const required = (val) => val && val.length;
const maxLength = (len) => (val) => !(val) || (val.length <= len);
const minLength = (len) => (val) => val && (val.length >= len);

class CommentForm extends Component{
    constructor(props)
    {
        super(props);
        this.state={
            modalOpen:false
        }
        this.handleToggle = this.handleToggle.bind(this);
        this.handleSubmit  = this.handleSubmit.bind(this);
    }
    handleToggle=()=> {
        this.setState( {modalOpen:!this.state.modalOpen} )
    }
    handleSubmit=(values)=>{
        this.handleToggle();
        this.props.postComment(this.props.dishId, values.rating, values.author, values.comment);
    }
    render(){
        return (
            <React.Fragment>
                <Button outline onClick={this.handleToggle}><span className="fa fa-pencil fa-lg"></span>{' '}Submit Comment</Button>
                <Modal isOpen={this.state.modalOpen} toggle={this.handleToggle}>
                    <ModalHeader toggle={this.handleToggle}>
                        Submit Comment
                    </ModalHeader>
                    <ModalBody>
                        <LocalForm onSubmit={(value)=>this.handleSubmit(value)}>
                        <Row className="form-group">
                                    <Label htmlFor="rating" md={4}>Rating</Label>
                                    <Col md={12}>
                                        <Control.select model=".rating" id="rating" name="rating"
                                            className="form-control"
                                            >
                                            <option>1</option>
                                            <option>2</option>
                                            <option>3</option>
                                            <option>4</option>
                                            <option>5</option>
                                        </Control.select>
                                    </Col>
                        </Row>
                        <Row className="form-group">
                                    <Label htmlFor="author" md={4}>Your Name</Label>
                                    <Col md={12}>
                                        <Control.text model=".author" id="author" name="author"
                                            placeholder="Your Name"
                                            className="form-control"
                                            validators={{
                                                minLength: minLength(3), maxLength: maxLength(15)
                                            }}
                                            />
                                        <Errors
                                            className="text-danger"
                                            model=".author"
                                            show="touched"
                                            messages={{
                                                minLength: 'Must be greater than 2 characters',
                                                maxLength: 'Must be 15 characters or less'
                                            }}
                                        />
                                    </Col>
                                </Row>
                                <Row className="form-group">
                                    <Label htmlFor="comment" md={4}>Comment</Label>
                                    <Col md={12}>
                                        <Control.textarea model=".comment" id="comment" name="comment"
                                            className="form-control"
                                            validators={{
                                                required
                                            }}
                                            rows="6"
                                            />
                                        <Errors
                                            className="text-danger"
                                            model=".comment"
                                            show="touched"
                                            messages={{
                                                required:'Comment Required'
                                            }}
                                        />
                                    </Col>
                                </Row>
                                <Row className="form-group">
                                <Col >
                                    <Button type="submit" color="primary" >Submit</Button>
                                </Col>
                                </Row>
                        </LocalForm>
                    </ModalBody>
                </Modal>
            </React.Fragment>
        )
    }
}

    function RenderDish({dish}) {

        if (dish != null) {
            return (
                <div className='col-12 col-md-5 m-1'>
                    <FadeTransform in transformProps={{ exitTransform: 'scale(0.5) translateY(-50%)' }}>
                        <Card>
                            <CardImg top src={baseUrl + dish.image} alt={dish.name} />
                            <CardBody>
                                <CardTitle> {dish.name}</CardTitle>
                                <CardText> {dish.description} </CardText>
                            </CardBody>
                        </Card>
                    </FadeTransform>
                </div>   
            );
        }
        else {
            return (
                <div></div>
            );
        }
    }

    function RenderComments({comments, postComment, dishId}){
        if (comments == null) {
            return (<div></div>)
        }
        const cmnts = comments.map(comment => {
            return (
                <Fade in>
                <li key={comment.id}>
                    <p>{comment.comment}</p>
                    <p>-- {comment.author},
                    &nbsp;
                    {new Intl.DateTimeFormat('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: '2-digit'
                    }).format(new Date(Date.parse(comment.date)))}
                    </p>
                </li>
                </Fade>
            )
        })
        return (
            <div className='col-12 col-md-5 m-1'>
                <h4> Comments </h4>
                <ul className='list-unstyled'>
                    <Stagger in>
                        {cmnts}
                    </Stagger>
                    <CommentForm dishId={dishId} postComment={postComment} />
                </ul>

            </div>
        )
    }

    const DishDetail = (props) =>{
        if (props.isLoading) {
            return(
                <div className="container">
                    <div className="row">            
                        <Loading />
                    </div>
                </div>
            );
        }
        else if (props.errMess) {
            return(
                <div className="container">
                    <div className="row">            
                        <h4>{props.errMess}</h4>
                    </div>
                </div>
            );
        }
        else if (props.dish != null)  {
            return (
                <div class="container">
                    <div className="row">
                        <Breadcrumb>
                            <BreadcrumbItem><Link to="/home">Home</Link></BreadcrumbItem>
                            <BreadcrumbItem><Link to="/menu">Menu</Link></BreadcrumbItem>
                            <BreadcrumbItem active>{props.dish.name}</BreadcrumbItem>
                        </Breadcrumb>
                        <div className="col-12">
                            <h3>{props.dish.name}</h3>
                            <hr />
                        </div>                
                    </div>
                    <div className='row'>
                        <RenderDish dish={props.dish} />
                        <RenderComments comments={props.comments}
                            postComment={props.postComment}
                            dishId={props.dish.id}
                        />
                    </div>
                </div>
            )
        }
    }

export default DishDetail;