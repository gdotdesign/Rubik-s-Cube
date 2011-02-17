require 'sinatra'

set :run, true
set :port, 9080

get '/' do
  send_file('index.html')
end
get '/vendor/:file' do
  send_file 'vendor/'+params[:file]
end
get '/style/:file' do
  send_file 'style/'+params[:file]
end
get '/builds/:file' do
  send_file 'builds/'+params[:file]
end
