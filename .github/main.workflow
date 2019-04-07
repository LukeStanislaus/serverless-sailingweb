workflow "New workflow 1" {
  on = "push"
  resolves = ["GitHub Action for AWS"]
}

action "Enter clientapp" {
  uses = "./clientapp"
  runs = "npm run build"
}

action "GitHub Action for AWS" {
  uses = "actions/aws/cli@efb074ae4510f2d12c7801e4461b65bf5e8317e6"
  needs = ["Enter clientapp"]
  runs = "aws s3 sync ./clientapp/build s3://sailingweb"
  secrets = ["AWS_ACCESS_KEY_ID", "AWS_SECRET_ACCESS_KEY"]
}

workflow "New workflow" {
  on = "push"
  resolves = ["./backend"]
}

action "./backend" {
  uses = "./backend"
  runs = "yarn deploy"
}
